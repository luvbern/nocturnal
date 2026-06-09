async function loadFeed() {

  const response = await fetch("/pages/changelog.xml");

  const text = await response.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");

  const items = xml.querySelectorAll("item");

  const container = document.getElementById("updates-feed");

  items.forEach(item => {

    const title =
      item.querySelector("title")?.textContent || "";

    const link =
      item.querySelector("link")?.textContent || "#";

    const pubDate =
      item.querySelector("pubDate")?.textContent || "";

    const description =
      item.querySelector("description")?.textContent || "";

    const post = document.createElement("div");

    post.className = "feed-post";

    post.innerHTML = `
     <img class="feed-avatar" src="https://file.garden/ag8JwXEGxlB3Dv6B/Borders/trashcanme.png" alt="avatar">
      <div class="feed-content">

        <div class="feed-header">
          <span class="feed-name">
            Bern
          </span>

          <span class="feed-date">
            ${new Date(pubDate).toLocaleDateString()}
          </span>
        </div>

        <div class="feed-title">
          ${title}
        </div>

        <div class="feed-text">
          ${description}
        </div>

         <a class="feed-link" href="${link}">
         View Update
        </a>

      </div>
    `;

    container.appendChild(post);

  });

}

loadFeed();
