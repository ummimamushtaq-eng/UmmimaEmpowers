document.addEventListener('DOMContentLoaded', function () {
    const BLOG_DATA_URL = './blogs/index.json';
    const fallbackImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?auto=format&fit=crop&w=900&q=80';

    let allPosts = [];
    let activeCategory = 'All';
    let activeSearch = '';

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
        try {
            const response = await fetch(BLOG_DATA_URL, { cache: 'no-store' });

            if (!response.ok) {
                throw new Error('Could not load blog posts.');
            }

            const posts = await response.json();

            if (!Array.isArray(posts)) {
                throw new Error('Blog data must be an array.');
            }

            allPosts = posts
                .filter(post => post && post.title && post.slug)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            renderHomePosts();
            renderBlogPage();
            openPostFromHash();
        } catch (error) {
            console.error(error);

            if (homeBlogPosts) {
                homeBlogPosts.innerHTML = '<p class="blog-error">Articles could not load. Please check blogs/index.json.</p>';
            }

            if (blogPosts) {
                blogPosts.innerHTML = '<p class="blog-error">Articles could not load. Please check blogs/index.json.</p>';
            }
        }
    }

    function renderHomePosts() {
        if (!homeBlogPosts) return;

        const latestPosts = allPosts.slice(0, 3);

        if (!latestPosts.length) {
            homeBlogPosts.innerHTML = '<p class="blog-empty">No articles published yet.</p>';
            return;
        }

        homeBlogPosts.innerHTML = latestPosts.map(post => `
            <article class="article-card">
                <div class="article-image">
                    <img src="${escapeHTML(post.image || fallbackImage)}" alt="${escapeHTML(post.title)}" loading="lazy" onerror="this.src='${fallbackImage}'">
                </div>

                <div class="article-content">
                    <span class="article-category">${escapeHTML(post.category || 'Article')}</span>
                    <h3>${escapeHTML(post.title)}</h3>
                    <p>${escapeHTML(post.excerpt || getShortText(post.content, 140))}</p>
                    <a href="blog.html#post-${encodeURIComponent(post.slug)}" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }

    function renderBlogPage() {
        if (!blogPosts) return;

        renderCategories();
        renderRecentPosts();

        const filteredPosts = getFilteredPosts();

        if (!filteredPosts.length) {
            blogPosts.innerHTML = `
                <div class="blog-empty">
                    <h3>No articles found</h3>
                    <p>Try another search term or category.</p>
                </div>
            `;
            return;
        }

        blogPosts.innerHTML = filteredPosts.map((post, index) => createBlogCard(post, index)).join('');

        document.querySelectorAll('[data-open-post]').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const slug = this.getAttribute('data-open-post');
                openPostModal(slug);
            });
        });
    }

    function createBlogCard(post, index) {
        const isFeatured = index === 0 && activeCategory === 'All' && activeSearch === '';

        return `
            <article class="blog-post ${isFeatured ? 'featured-post' : ''}">
                <div class="post-image">
                    <img src="${escapeHTML(post.image || fallbackImage)}" alt="${escapeHTML(post.title)}" loading="lazy" onerror="this.src='${fallbackImage}'">
                </div>

                <div class="post-content">
                    <div class="post-meta">
                        ${isFeatured ? '<span class="post-category">Featured</span>' : ''}
                        <span class="post-category">${escapeHTML(post.category || 'Article')}</span>
                        <span class="post-date"><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                        <span class="post-author"><i class="fas fa-user"></i> ${escapeHTML(post.author || 'Ummima Team')}</span>
                    </div>

                    <h2>${escapeHTML(post.title)}</h2>
                    <p class="post-excerpt">${escapeHTML(post.excerpt || getShortText(post.content, 190))}</p>

                    <a href="#post-${encodeURIComponent(post.slug)}" class="${isFeatured ? 'btn btn-primary' : 'read-more-link'}" data-open-post="${escapeHTML(post.slug)}">
                        ${isFeatured ? 'Read Full Article' : 'Read More <i class="fas fa-arrow-right"></i>'}
                    </a>
                </div>
            </article>
        `;
    }

    function renderCategories() {
        if (!categoryList) return;

        const counts = allPosts.reduce((acc, post) => {
            const category = post.category || 'Article';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const total = allPosts.length;

        let html = `
            <li>
                <a href="#" class="category-link ${activeCategory === 'All' ? 'active' : ''}" data-category="All">
                    <span><i class="fas fa-tag"></i> All Posts</span>
                    <span>${total}</span>
                </a>
            </li>
        `;

        Object.keys(counts).sort().forEach(category => {
            html += `
                <li>
                    <a href="#" class="category-link ${activeCategory === category ? 'active' : ''}" data-category="${escapeHTML(category)}">
                        <span><i class="fas fa-tag"></i> ${escapeHTML(category)}</span>
                        <span>${counts[category]}</span>
                    </a>
                </li>
            `;
        });

        categoryList.innerHTML = html;

        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                activeCategory = this.getAttribute('data-category') || 'All';
                renderBlogPage();

                window.scrollTo({
                    top: document.querySelector('.blog-header')?.offsetTop || 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    function renderRecentPosts() {
        if (!recentPostsList) return;

        const recent = allPosts.slice(0, 5);

        if (!recent.length) {
            recentPostsList.innerHTML = '<li>No recent posts.</li>';
            return;
        }

        recentPostsList.innerHTML = recent.map(post => `
            <li>
                <a href="#post-${encodeURIComponent(post.slug)}" class="recent-post-title" data-open-post="${escapeHTML(post.slug)}">
                    ${escapeHTML(post.title)}
                </a>
                <span class="recent-post-date">${formatDate(post.date)}</span>
            </li>
        `).join('');
    }

    function getFilteredPosts() {
        return allPosts.filter(post => {
            const categoryMatch = activeCategory === 'All' || post.category === activeCategory;

            const searchText = [
                post.title,
                post.category,
                post.author,
                post.excerpt,
                stripHTML(post.content)
            ].join(' ').toLowerCase();

            const searchMatch = !activeSearch || searchText.includes(activeSearch.toLowerCase());

            return categoryMatch && searchMatch;
        });
    }

    function openPostModal(slug) {
        const post = allPosts.find(item => item.slug === slug);

        if (!post || !blogModal || !blogModalBody) {
            return;
        }

        blogModalBody.innerHTML = `
            <article class="single-post-view">
                <img class="single-post-image" src="${escapeHTML(post.image || fallbackImage)}" alt="${escapeHTML(post.title)}" onerror="this.src='${fallbackImage}'">

                <div class="single-post-meta">
                    <span>${escapeHTML(post.category || 'Article')}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    <span><i class="fas fa-user"></i> ${escapeHTML(post.author || 'Ummima Team')}</span>
                    <span><i class="fas fa-clock"></i> ${calculateReadTime(post.content)} min read</span>
                </div>

                <h1>${escapeHTML(post.title)}</h1>

                <div class="single-post-content">
                    ${sanitizeHTML(post.content || '')}
                </div>
            </article>
        `;

        blogModal.classList.add('active');
        blogModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (history.pushState) {
            history.pushState(null, '', `#post-${encodeURIComponent(slug)}`);
        }
    }

    function closePostModal() {
        if (!blogModal) return;

        blogModal.classList.remove('active');
        blogModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (window.location.hash.startsWith('#post-')) {
            history.pushState('', document.title, window.location.pathname);
        }
    }

    function openPostFromHash() {
        if (!window.location.hash.startsWith('#post-')) return;

        const slug = decodeURIComponent(window.location.hash.replace('#post-', ''));

        if (slug) {
            setTimeout(() => openPostModal(slug), 300);
        }
    }

    function formatDate(dateString) {
        if (!dateString) return 'No date';

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function getShortText(html, maxLength) {
        const text = stripHTML(html || '');

        if (text.length <= maxLength) return text;

        return text.substring(0, maxLength).trim() + '...';
    }

    function stripHTML(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html || '';
        return temp.textContent || temp.innerText || '';
    }

    function escapeHTML(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function sanitizeHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html || '';

        template.content.querySelectorAll('script, iframe, object, embed, style').forEach(el => el.remove());

        template.content.querySelectorAll('*').forEach(el => {
            [...el.attributes].forEach(attr => {
                const attrName = attr.name.toLowerCase();
                const attrValue = attr.value.toLowerCase();

                if (attrName.startsWith('on') || attrValue.includes('javascript:')) {
                    el.removeAttribute(attr.name);
                }
            });
        });

        return template.innerHTML;
    }

    function calculateReadTime(html) {
        const words = stripHTML(html).trim().split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(words / 200));
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            activeSearch = this.value.trim();
            renderBlogPage();
        });

        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                activeSearch = this.value.trim();
                renderBlogPage();
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            activeSearch = searchInput ? searchInput.value.trim() : '';
            renderBlogPage();
        });
    }

    if (clearFilterButton) {
        clearFilterButton.addEventListener('click', function () {
            activeCategory = 'All';
            activeSearch = '';

            if (searchInput) searchInput.value = '';

            renderBlogPage();
        });
    }

    if (blogModal) {
        blogModal.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-close-modal')) {
                closePostModal();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && blogModal.classList.contains('active')) {
                closePostModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if ((e.key === 's' || e.key === 'S') && searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    loadPosts();
});
