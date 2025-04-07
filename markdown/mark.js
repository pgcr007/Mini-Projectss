const textarea = document.getElementById('markdown');
const preview =  document.getElementById('preview');
const boldbtn = document.getElementById('bold-btn');
const italicbtn = document.getElementById('italic-btn');
const linkbtn = document.getElementById('link-btn');
const codebtn = document.getElementById('code-btn');
const savebtn = document.getElementById('save-btn');
const themeselect = document.getElementById('theme-select');

textarea.value= '# Welcome to the Markdown Editor use the toolbar above to format your text!                      ## Features                  *Real-Time preview                   *Theme switching          *toolbar for quick formating             *File saving capability         #Code Example                    Javascript                       function greet(name){           return hello, ${name}            }                                 console.log(greet("world"))';

marked.setOptions({
    breaks:true,
    gfm: true,
    highlight: function(code, lang)
    {
        try{
            return h1js.highlight(code, {language: lang || 'plaintext'}).value;
        } catch(e)
        {
            return h1js.highlightAuto(code).value;
        }
    }

});

function updatepreview(){
    const markdowntext = textarea.value;
    const html = marked.parse(markdowntext);
    preview.innerHTML = html;
}

function insertext(before, after = '')
{
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) ||  'text';
    const newText = before + selectedText + after;
    textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    updatepreview();
}

boldbtn.addEventListener('click', () => insertext('**', '**'));
italicbtn.addEventListener('click', () => insertext('*', '*'));
linkbtn.addEventListener('click', () => insertext('[','](https://example.com)'));
codebtn.addEventListener('click', () => insertext('```javascript\n', '\n```'));

savebtn.addEventListener('click', () => {
    const blob = new Blob([textarea.value], {type: 'text\markdown'});
    const url = URL.createObjectURL;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown.md';
    a.click();
    URL.revokeObjectURL(url);  
});


themeselect.addEventListener('change', () => {
    document.body.className = themeselect.value;
    localStorage.setItem('theme', themeselect.value);
    updatepreview();
});

const savedTheme = localStorage.getItem('theme') || 'light';
document.body.className = savedTheme;
themeselect.value = savedTheme;

textarea.addEventListener('input', updatepreview);

updatepreview();