// Blog page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                alert('Search for: ' + searchTerm + '\n\nFeature coming soon! You can search for articles about women\'s rights, empowerment, education, and more.');
                searchInput.value = '';
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Category filter functionality
    const categoryLinks = document.querySelectorAll('.categories-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.split('(')[0].trim();
            alert('Filtering articles by: ' + category + '\n\nFilter functionality coming soon!');
        });
    });

    // Recent posts - make clickable
    const recentPosts = document.querySelectorAll('.recent-post-title');
    recentPosts.forEach(post => {
        post.style.cursor = 'pointer';
        post.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Article: ' + this.textContent + '\n\nFull article view coming soon!');
        });
    });

    // Blog post read more buttons
    const readMoreLinks = document.querySelectorAll('.read-more-link, .btn');
    readMoreLinks.forEach(link => {
        if (link.textContent.includes('Read')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const postTitle = this.closest('.blog-post, .featured-post')?.querySelector('h2')?.textContent;
                alert('Opening article: ' + (postTitle || 'Article') + '\n\nFull article page coming soon!');
            });
        }
    });

    // Smooth scroll animations
    const blogPosts = document.querySelectorAll('.blog-post');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'slideUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    blogPosts.forEach(post => {
        observer.observe(post);
    });

    // Add hover effects to blog posts
    blogPosts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 50px rgba(233, 30, 99, 0.2)';
        });
        post.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(233, 30, 99, 0.1)';
        });
    });

    // Widget animations
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach((widget, index) => {
        widget.style.animation = `fadeInUp 0.8s ease ${0.1 * (index + 1)}s both`;
    });

    console.log('Blog page loaded with all interactive features ready!');
});

// Add keyboard shortcuts for accessibility
document.addEventListener('keydown', function(e) {
    // Press 's' to focus search
    if (e.key === 's' || e.key === 'S') {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
});