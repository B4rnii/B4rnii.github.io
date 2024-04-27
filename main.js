function
StringFitsFilter(str, filter)
{
	let match = true;
	let filter_upper = filter.toUpperCase();
	let filter_substrings = filter_upper.split(/[ _*]+/);
	let str_upper = str.toUpperCase();
	let minimum_index = 0;

	for(let i = 0; i < filter_substrings.length; ++i)
	{
		if(filter_substrings[i].length > 0)
		{
			let index_of_substring = str_upper.indexOf(filter_substrings[i], minimum_index);
			if(index_of_substring < 0 || index_of_substring < minimum_index)
			{
				match = false;
				break;
			}
			minimum_index = index_of_substring + filter_substrings[i].length - 1;
		}
	}

	return match;
}

function
UpdateListByFilter(menu_id, filter_id)
{
	let ul = document.getElementById(menu_id);
	let li = ul.getElementsByTagName("li");
	let input = document.getElementById(filter_id);
	let filter = input.value.toUpperCase();
	for(let i = 0; i < li.length; i++)
	{
		if(filter.length > 0)
		{
			let a = li[i].getElementsByTagName("a")[0];
			if(StringFitsFilter(a.innerHTML, filter))
			{
				li[i].style.display = "";
			}
			else
			{
			    li[i].style.display = "none";
			}
		}
		else
		{
			li[i].style.display = "";
		}
	}
}

function
SearchInput(event, lister_idx)
{
	UpdateListByFilter("lister_"+lister_idx, "lister_search_"+lister_idx);
}

function
SearchKeyDown(event, lister_idx)
{
	UpdateListByFilter("lister_"+lister_idx, "lister_search_"+lister_idx);
}

function
CalculateBlogPostReadTime(content)
{
	var wordsPerMinute = 200;
	var wordCount = content.split(/\s+/).length;
	var readTime = Math.ceil(wordCount / wordsPerMinute);
	return readTime + ' min read';
}

function
OnBlogLoad()
{
	let ul = document.getElementById("lister_0");
	let li = ul.getElementsByTagName("li");
	for(let i = 0; i < li.length; i++)
	{
		let a = li[i].getElementsByTagName("a")[0];
		fetch(a.href)
        .then(response => response.text())
        .then(data => {
          var content = new DOMParser().parseFromString(data, 'text/html').querySelector('body').innerText;
          var readTime = CalculateBlogPostReadTime(content);
		  let rt = li[i].getElementsByClassName("lister_item_read_time")[0];
		  rt.innerHTML = readTime;
        })
        .catch(error => console.error('Error fetching post content:', error));
	}
}

function
OnBlogPostLoad()
{
	var content = document.querySelector('body').innerText;
	var readTime = CalculateBlogPostReadTime(content);
	let rt = document.getElementsByClassName("read_time")[0];
	rt.innerHTML = readTime;
}

function
ShowCopiedPopup(box_id)
{
    var popup = document.getElementById(box_id);
    popup.classList.remove("copied_popup_animation_class");
    popup.offsetHeight; // Trigger reflow
    popup.classList.add("copied_popup_animation_class");
    popup.style.display = "inline-block";
}

function
SetClipboard(content, box_id)
{
    navigator.permissions.query({ name: "clipboard-write" }).then((result) =>
    {
        if (result.state == "granted" || result.state == "prompt")
        {
            navigator.clipboard.writeText(content);
        }
    });

	ShowCopiedPopup(box_id);
}