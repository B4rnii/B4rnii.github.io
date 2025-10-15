let posts_metadata = [];
let active_tags = new Set();

const posts_container = document.getElementById("posts_container_0");
const tags_container = document.getElementById("tags_container_0");
const search_input = document.getElementById("lister_search_0");

//- Barni: Load posts metadata
fetch("posts-data.json")
    .then(res => res.json())
    .then(data => {
        posts_metadata = data;
        RenderTags();
        RenderPosts();
    })
    .catch(err => console.error('Error loading posts metadata:', err));

function RenderTags() {
    const all_tags = [...new Set(posts_metadata.flatMap(p => p.tags))];
    tags_container.innerHTML = '';
    all_tags.forEach(tag => {
        const tag_el = document.createElement("div");
        tag_el.className = "tag";
        tag_el.innerText = tag;
        tag_el.onclick = () => {
            if (active_tags.has(tag)) active_tags.delete(tag);
            else active_tags.add(tag);
            tag_el.classList.toggle("active");
            RenderPosts();
        };
        tags_container.appendChild(tag_el);
    });
}

function CalculatePostReadTime(content) {
    var words_per_minute = 200;
    var word_count = content.split(/\s+/).length;
    var read_time = Math.ceil(word_count / words_per_minute);
    return read_time + ' min read';
}

function RenderPosts() {
    const search_term = search_input.value.toLowerCase();
    posts_container.innerHTML = '';

    const filtered_posts = posts_metadata.filter(post => {
        const matches_search = post.title.toLowerCase().includes(search_term);
        const matches_tags = active_tags.size === 0 || post.tags.some(t => active_tags.has(t));
        return matches_search && matches_tags;
    });

    filtered_posts.forEach(post => {
        fetch(`../posts/${post.file}`)
            .then(res => res.text())
            .then(html => {
                const post_el = document.createElement("div");
                post_el.className = "post";
                const temp_div = document.createElement('div');
                temp_div.innerHTML = html;
                const first_paragraph = temp_div.querySelector('p')?.innerText || '';
                var content = new DOMParser().parseFromString(html, 'text/html').querySelector('body').innerText;
                var read_time = CalculateBlogPostread_time(content);

                post_el.innerHTML = `
                <a class="lister_item_link" href="../posts/${post.file}">
                    <div class="post_image" style="background-image:url('${post.img}')"></div>
                    <div class="lister_item_text">
                <div class="lister_item_title">${post.title}</div>
                <div class="lister_item_date">${post.date}</div>
                <div class="lister_item_desc">${first_paragraph}</div>
                <div class="lister_item_read_time">${read_time}</div>
                </div>
                    </a>
                `;
                posts_container.appendChild(post_el);
            });
    });
}

search_input.addEventListener("input", RenderPosts);