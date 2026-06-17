document.addEventListener('DOMContentLoaded', function () {

    const BLOG_DATA_URL = './blogs/index.json';
    const fallbackImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?auto=format&fit=crop&w=900&q=80';

    let allPosts = [];
    let activeCategory = 'All';
    let activeSearch = '';
    let currentPage = 1;
    const postsPerPage = 10;

    const homeBlogPosts = document.getElementById('homeBlogPosts');
    const blogPosts = document.getElementById('blogPosts');
    const categoryList = document.getElementById('categoryList');
    const recentPostsList = document.getElementById('recentPostsList');
    const searchInput = document.getElementById('blogSearchInput');
    const searchButton = document.getElementById('blogSearchButton');
    const clearFilterButton = document.getElementById('clearBlogFilter');
    const blogModal = document.getElementById('blogModal');
    const blogModalBody = document.getElementById('blogModalBody');

    async function loadPosts() {
        const response = await fetch(BLOG_DATA_URL, { cache: 'no-store' });
        const posts = await response.json();

        allPosts = posts
            .filter(post => post && post.title && post.slug)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        renderHomePosts();
        renderBlogPage();
    }

    function renderHomePosts() {
        if (!homeBlogPosts) return;

        const latestPosts = allPosts.slice(0, 3);

        homeBlogPosts.innerHTML = latestPosts.map(post => `
            <article class="article-card">
                <img src="${post.image || fallbackImage}" />
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="blog.html#post-${post.slug}">Read More</a>
            </article>
        `).join('');
    }

    function renderBlogPage() {
        if (!blogPosts) return;

        renderCategories();
        renderRecentPosts();

        let filteredPosts = getFilteredPosts();

        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;

        const paginatedPosts = filteredPosts.slice(start, end);

        blogPosts.innerHTML = paginatedPosts.map(post => createBlogCard(post)).join('');

        renderPagination(filteredPosts.length);

        document.querySelectorAll('[data-open-post]').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openPostModal(this.dataset.openPost);
            });
        });
    }

    function createBlogCard(post) {
        return `
            <article class="blog-post">
                <img src="${post.image || fallbackImage}" />
                <h2>${post.title}</h2>
                <p>${post.excerpt}</p>
                <a href="#" data-open-post="${post.slug}">Read More</a>
            </article>
        `;
    }

    function renderPagination(totalPosts) {

        let pagination = document.getElementById('pagination');

        if (!pagination) {
            pagination = document.createElement('div');
            pagination.id = 'pagination';
            blogPosts.parentNode.appendChild(pagination);
        }

        const totalPages = Math.ceil(totalPosts / postsPerPage);

        pagination.innerHTML = `
            <button onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button onclick="nextPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
    }

    window.prevPage = function () {
        if (currentPage > 1) {
            currentPage--;
            renderBlogPage();
        }
    };

    window.nextPage = function (totalPages) {
        if (currentPage < totalPages) {
            currentPage++;
            renderBlogPage();
        }
    };

    function getFilteredPosts() {
        return allPosts.filter(post => {
            return (activeCategory === 'All' || post.category === activeCategory);
        });
    }

    function renderCategories() {}
    function renderRecentPosts() {}

    function openPostModal(slug) {
        const post = allPosts.find(p => p.slug === slug);
        if (!post) return;

        alert(post.title + "\n\n" + post.content.replace(/<[^>]*>/g, ''));
    }

    loadPosts();
});
