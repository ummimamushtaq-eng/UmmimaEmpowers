document.addEventListener('DOMContentLoaded', function () {

    const BLOG_DATA_URL = './blogs/index.json';
    const fallbackImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a5';

    let allPosts = [];

    const homeBlogPosts = document.getElementById('homeBlogPosts');
    const blogPosts = document.getElementById('blogPosts');
    const blogModal = document.getElementById('blogModal');
    const blogModalBody = document.getElementById('blogModalBody');

    async function loadPosts() {
        const res = await fetch(BLOG_DATA_URL);
        allPosts = await res.json();

        renderHomePosts();
        renderBlogPage();
    }

    /* ===== HOME PAGE ===== */
    function renderHomePosts() {
        if (!homeBlogPosts) return;

        const latest = allPosts.slice(0, 3);

        homeBlogPosts.innerHTML = latest.map(post => `
            <article class="article-card">

                <div class="article-image">
                    <img src="${post.image || fallbackImage}">
                </div>

                <div class="article-content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="blog.html#${post.slug}">Read More</a>
                </div>

            </article>
        `).join('');
    }

    /* ===== BLOG PAGE ===== */
    function renderBlogPage() {
        if (!blogPosts) return;

        blogPosts.innerHTML = allPosts.map(post => `
            <article class="blog-post">

                <img src="${post.image || fallbackImage}">

                <div class="post-content">
                    <h2>${post.title}</h2>
                    <p class="post-excerpt">${post.excerpt}</p>

                    <a href="#" data-open="${post.slug}">
                        Read Full Article
                    </a>
                </div>

            </article>
        `).join('');

        document.querySelectorAll('[data-open]').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal(this.dataset.open);
            });
        });
    }

    /* ===== MODAL FIX ===== */
    function openModal(slug) {
        const post = allPosts.find(p => p.slug === slug);
        if (!post) return;

        blogModalBody.innerHTML = `
            <h1>${post.title}</h1>
            <img src="${post.image}" style="width:100%;margin:20px 0;">
            <div>${post.content}</div>
        `;

        blogModal.classList.add('active');
    }

    /* ===== CLOSE MODAL ===== */
    if (blogModal) {
        blogModal.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-close-modal')) {
                blogModal.classList.remove('active');
            }
        });
    }

    loadPosts();
});
