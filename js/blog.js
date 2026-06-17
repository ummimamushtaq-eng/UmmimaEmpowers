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
    const blogModal = document.getElementById('blogModal');
    const blogModalBody = document.getElementById('blogModalBody');

    async function loadPosts() {
        const response = await fetch(BLOG_DATA_URL);
        const posts = await response.json();

        allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderHomePosts();
        renderBlogPage();
    }

    // ✅ FIXED HOME PAGE (restores your layout)
    function renderHomePosts() {
        if (!homeBlogPosts) return;

        const latestPosts = allPosts.slice(0, 3);

        homeBlogPosts.innerHTML = latestPosts.map(post => `
            <article class="article-card">

                <div class="article-image">
                    <img src="${post.image || fallbackImage}" alt="${post.title}">
                </div>

                <div class="article-content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="blog.html#post-${post.slug}">Read More</a>
                </div>

            </article>
        `).join('');
    }

    // ✅ BLOG PAGE WITH PAGINATION
    function renderBlogPage() {
        if (!blogPosts) return;

        let filtered = allPosts;

        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;

        const pagePosts = filtered.slice(start, end);

        blogPosts.innerHTML = pagePosts.map(post => `
            <article class="blog-post">

                <img src="${post.image || fallbackImage}" alt="${post.title}">

                <h2>${post.title}</h2>

                <p>${post.excerpt}</p>

                <a href="#" data-open-post="${post.slug}">Read Full Article</a>

            </article>
        `).join('');

        renderPagination(filtered.length);

        document.querySelectorAll('[data-open-post]').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openPostModal(this.dataset.openPost);
            });
        });
    }

    // ✅ PAGINATION FIXED
    function renderPagination(total) {

        let pagination = document.getElementById('pagination');

        if (!pagination) {
            pagination = document.createElement('div');
            pagination.id = 'pagination';
            blogPosts.parentNode.appendChild(pagination);
        }

        const totalPages = Math.ceil(total / postsPerPage);

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

    // ✅ MODAL FIX (THIS WAS MISSING)
    function openPostModal(slug) {

        const post = allPosts.find(p => p.slug === slug);
        if (!post) return;

        if (!blogModal || !blogModalBody) {
            alert(post.title + "\n\n" + post.content.replace(/<[^>]*>/g, ''));
            return;
        }

        blogModalBody.innerHTML = `
            <h1>${post.title}</h1>
            <img src="${post.image || fallbackImage}" style="width:100%">
            <div>${post.content}</div>
        `;

        blogModal.classList.add('active');
    }

    loadPosts();
});
