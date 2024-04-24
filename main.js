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