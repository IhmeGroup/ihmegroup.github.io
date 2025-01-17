# FxLab Website (2025)

This repository stores the code for the 2025 version of the FxLab website. 

The website is built using [Jekyll](https://jekyllrb.com) and served via Github Pages over Stanford's domain via a redirect, although, of course, it is also possible to host directly on Stanford's domain and use the internal filesystem. Both methods have pros and cons, which will not be discussed here. This code stands on the shoulders of the [al-folio Jekyll theme](https://github.com/alshedivat/al-folio) and is used under the MIT license. Note that in order to reduce the storage load on Stanford's filesystem, most if not all of the unused features from the al-folio theme have been removed. This documentation should cover everything needed to maintain the site. TLDR: If the feature isn't here, it isn't supported.

This README.md document contains instructions for building and updating the website.

## Table of Contents
- [FxLab Website](#fxlab-website-2025)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [MacOS](#macos)
    - [Linux](#linux-debian-ubuntu-mint)
  - [Building the site](#building-the-site)
  - [Pushing to production](#pushing-to-production)
  - [Editing contents](#editing-contents)
    - [Homepage](#homepage---_pagesaboutmd)
    - [Research page](#research-page---_pagesresearchhtml)
    - [People page](#people-page---_pagespeoplemd)
    - [Publications page](#publications-page---_pagespublicationsmd)
    - [Teaching page](#teaching-page---_pagesteachinghtml)
    - [Contact page](#contact-page---_pagescontactmd)
    - [More pages](#adding-more-pages)
    - [Other features](#other-features)
  - [License](#license)
  - [To-do list](#to-do-list)
 
---

## Getting started

In order to build the site, a local installation of [Jekyll](https://jekyllrb.com) and [Ruby](https://www.ruby-lang.org/en/) is required.

### MacOS

MacOS comes preinstalled with Ruby, but it is generally not recommended to use the system Ruby. Therefore, first install `chruby` and `ruby-install` with [Homebrew](https://brew.sh/) (if you don't have Homebrew on your Mac, install that first!).
```bash
brew install chruby ruby-install
```

Now, install a stable version of Ruby (e.g. 3.3.5):
```bash
ruby-install ruby 3.3.5
```

Configure the shell to automatically use `chruby` so that the system Ruby will not cause issues:
```bash
echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
echo "chruby ruby-3.3.5" >> ~/.zshrc # run 'chruby' to see actual version
```

Finally, **quit and relaunch the terminal**, then verify Ruby is working (`ruby -v`) and install Jekyll:
```bash
gem install jekyll
```

### Linux (Debian, Ubuntu, Mint)

Linux OS generally does not come preinstalled with Ruby, so you will need to install it yourself. Personally, I recommend using a Ruby manager like `rvm`, but you can just install the Ruby library and other prerequisites like so:
```bash
sudo apt-get install ruby-full build-essential zlib1g-dev
```

It is recommended to install gems (packages) on a user basis, running these lines of code in terminal will set this up (optional):
```bash
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Finally, install Jekyll and Bundler:
```
gem install jekyll bundler
```

---

## Building the site

First, clone the repository:
```bash
git clone https://github.com/ihmegroup/website
```

You can also fork the repository and clone that, if you prefer.

Then, `cd website` and build the site:
```bash
bundle exec jekyll build
```

If you'd like to preview, you can also run
```bash
bundle exec jekyll serve
```
which will build the site and run a daemon on your local machine.

There are some options/flags that this command takes, the most pertinent of which is `--livereload` (which will cause the browser to refresh every time the site is rebuilt, i.e., every time a file is updated). If you run into an error saying the port is unavailable, chances are that you have another instance of Jekyll running already (either because you are also working on another site at the moment, or because you forgot to terminate Jekyll the last time). If you'd like to work on multiple Jekyll sites at the same time, you can specify a different port (e.g. `--port 4001`). The default port is `4000`, so to preview the site in your browser, enter the URL `localhost:4000`.

### Important

Make sure to correctly set the `url` and `baseurl` fields in `_config.yml` before building the webpage. The url should be `fxlab.stanford.edu` and baseurl blank, do not delete it.

---

## Pushing to production

**Never push to production on Fridays!** (jk)

Once the site has been built, all the relevant files will be in the `_site` folder, ready to be uploaded to the Stanford domain. I also recommend cleaning up the CSS to remove unused classes, which speeds up loading time and reduces filesize, this can be done by running
```bash
purgecss -c purgecss.config.js
```
which will replace the CSS files in the `_site/assets/css/` folder with the purged css files.

If using Github pages, simply run `bundle exec jekyll clean` to remove the build files, then commit changes and push to the `main` branch. But we don't use this method right now, so just upload the `_site` folder to Stanford's servers.

---

## Editing contents

I have tried to make this code easy to update and maintain even for labmates with no experience or knowledge of web development tools to the best of my ability; however, if there are any issues or questions or bugs, please ask me and I will be happy to help. Alternatively, if urgent updates are required, the site is not building as expected, and you desperately need a quick fix without any debugging, you can simply edit the files in the `_site` folder and then push to production directly without going through the entire Jekyll build again. I don't recommend this, but sometimes, you gotta do what you gotta do :D

For labmates that are more familiar with web development, I highly recommend taking a little bit of time to learn about Jekyll and what it can do for you! But to summarize the important points, instead of having to manually code up each page individually and handwrite tens of thousands of lines of HTML markup, Jekyll uses liquid templating to generate contents so you can reuse the same code multiple times. The `research`, `teaching`, `capabilities`, `projects` and `announcements` sections on this site are all generated using Jekyll collections, making them easy to maintain - you really only need to know how to write markdown. 

For reference, this is the general repository structure, with Most Likely Changes annotated accordingly:

```txt
.
├── 📂 assets/: 
│   └── 📂 img/
    │   └── 📂 logos/: Contains the sponsor logos for the front page
    │   └── 📂 people/: Contains the profile pictures on the people page
│   └── 📂 pdf/: Contains PDF files, mostly Course Readers for the teaching page
├── 📂 _bibliography/
│   └── 📄 papers.bib: Bibliography in BibTeX format
├── 📂 _capabilities/: Contains the markdown for the Experimental/Computational description pages
├── 📄 _config.yml: Configuration file of the template
├── 📂 _includes/: 
├── 📂 _layouts/: 
├── 📂 _news/: Contains announcements for the homepage
├── 📂 _pages/: Contains the pages of the website
│   └── 📂 people/: 
    │   └── 📂 phdstudents/: Contains the profile markdown files for the PhD students
    │   └── 📂 postdocs/: Contains the profile markdown files for the postdocs
├── 📂 _projects/: Contains the research projects
├── 📂 _research/: Contains the research themes on the research page
└── 📂 _sass/: contains the SASS files that define the style of the website
    ├── 📄 _base.scss: base style of the website (most code is in here)
    ├── 📄 _layout.scss: style of the layouts (if you can't find it in _base.scss, check here)
    ├── 📄 _themes.scss: themes colors and a few icons
    └── 📄 _variables.scss: variables used in the SASS files
├── 📂 _site/: Final build files to upload to server (may not be present before site is built, see above)
├── 📂 _teaching/: Contains the course information on the teaching page
```

---

### Homepage - `_pages/about.md`

This front page is set up to display 4 images in a rotating carousel, social media links for the lab, introduction text, announcements, and sponsor logos. The social media links, announcements and sponsor logos are optional and can be turned off in the preamble, additionally, the site can also be set up to show some selected papers from the bibliograpy (add keyword `selected` to the bibtex entry in `papers.bib`).
```yml
news: true # includes a list of news items
selected_papers: false # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page
sponsors: true # Includes sponsors
```

#### Image carousel

The code is set up for 4 images right now, no more and no less (unless you are familiar with Sass/CSS and edit the animation yourself in `_sass/_layouts.scss` - look for `@keyframes crossfade` and `@keyframes positioning`, and also remember to edit the animation duration and animation-delay of the relevant classes.). The images can be changed in the preamble of `about.md`:
```yml
images: 
  - /assets/img/homepage1.gif
  - /assets/img/homepage2.jpeg
  - /assets/img/homepage3.png
  - /assets/img/homepage0.png
```
Note that due to the way the animation is set up for maximum smoothness, the image order is 4-1-2-3, that is to say the last image on the list is the first image shown on the page. Please keep this in mind.

If any of the images are changed, it is likely that you might also want to relocate the text and social media icons. To do this, go to `_sass/_layouts.scss`, look for `@keyframes crossfade`, and edit the code within that block. The percentages and opacity should not be changed, but the `max-width`, `text-align` and `float` properties can be adjusted depending on whether the content is left/right/center-aligned, use the table below to adjust. Note that you need to change the code for both the start and end percentages.

| **Alignment**   | **Left**                     | **Center**         | **Right**                    |
|-----------------|------------------------------|--------------------|------------------------------|
| `text-align`    | left                         | center             | right                        |
| `float`         | left                         | none               | right                        |
| `max-width`     | calc(0.5*$max-content-width) | $max-content-width | calc(0.5*$max-content-width) |

#### Introduction text

This is simply the content of the markdown file. It can be edited as necessary or even deleted. It also supports LaTex via MathJax!

#### Announcements

Up to 3 announcements can be displayed at once, even if there are more than 3 items in the `_news` folder. To edit announcements, simply open the relevant announcement markdown file in `_news` and change as per necessary.

#### Sponsor logos

These are hardcoded in `_includes/sponsors.liquid`. Play around with the HTML in that file if the arrangement doesn't look appealing to you. To add more logos, upload the file to `/assets/img/sponsors`, then add the sponsor in `_includes/sponsors.liquid`.

The `flex-4` class displays 4 logos in a row on mobile, while the `flex-3` class displays 3 logos in a row on mobile. Other than that, on larger screen sizes, all the logos will be shown in a straight row with maximum height of 100px.

---

### Research page - `_pages/research.html`

This page shows a list of the lab research split into 3 broad themes of propulsion, energy and environment. Likewise, each of the three broad categories are controlled by the relevant files in `_research` folder. Also, the lab research capabilities are controlled by the relevant files in `_capabilities`, including the title and the image (`img` keyword). The background and text color of each of the research blocks are controlled by the `background` and `text` keyword in the preamble, and if `padded` is set to `true`, then the image will not sit flush with the border and instead have a margin around it. Finally, the `align` keyword controls how the image will be cropped (left means it will crop from the right, etc). Finally, the `grouping` keyword links the projects to the specific research box (see [Projects](#projects) below), and the `mode` keyword sets the overlay on the projects to `dark` or `light`, respectively (with corresponding text color). An example preamble is shown below:
```yaml
---
layout: default
title: Propulsion
img: /assets/img/flatrdre.jpeg
align: left
padded: true
background: "#0f1c50"
text: "#ffffff"
grouping: propulsion
mode: dark
---
```

#### Projects

The projects on each of the research boxes link to their own page when clicked, which are all located in the `_projects` folder. These can be either markdown `.md` or HTML `.html` depending on user's preference (markdown is generally easier since not all labmates know HTML). The research page looks best with maybe 3-4 projects per category, but you can add as many as you want. Right now, each category is in its own folder, but this is only for organization and does not really affect anything. More important is the preamble of each of the project pages, which looks like
```yaml
layout: page
title: Modeling of Scramjet Combustors
img: /assets/img/projects/scramjet_2.png
importance: 99
category: propulsion
related_publications: false
```

The `category` keyword should correspond to whatever is written in the `grouping` for the research box. That is, if a project is to appear in the `propulsion` box, where the `grouping` keyword in the preamble is `propulsion`, then in the preamble of the project page, the `category` keyword **must** be `propulsion`. This pairing is important, otherwise the page will exist but won't be linked on the research page. The `img` keyword determines what image is displayed in the project box of the research page, and if there are any papers cited in the content of the project page (using `{% cite BIB_KEY %}`), the `related_publications` keyword can be set to `true` to automatically display the bibliography.

To better describe the project, the code also supports video and image embeds. To embed an image, put the image in the `/assets/img/projects` folder and use this HTML code (also works in markdown!)
```html
<div class="row justify-content-sm-center">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/THE_IMAGE.jpg" title="IMAGE TITLE" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
```
It is also possible to have two or three images in a row, simply make a few copies of the middle three lines and place them inside the `row` `<div>`. For a better explanation or more examples, please refer to the other existing pages, or the [al-folio example project page code](https://github.com/alshedivat/al-folio/blob/c5d0e92dbd9f2d7f12f2f08089340f880dbd45d1/_projects/1_project.md?plain=1).

For videos, the idea is similar, you can either go to Youtube and copy/paste the embed code, or you can use the native video player (recommended for accessibility). To use the native video player, copy the `.mp4` video file into the `assets/video` folder and paste this HTML code where you would like the video to appear:
```html
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/FILENAME.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true muted=true loop=true %}
    </div>
</div>
```
Of course, feel free to remove some of the keywords like `autoplay`, `loop`, `muted` if you would like those to not apply to the video. Similar to the images you can also have multiple videos in a row, here is an example also including a Youtube embed:
```html
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="https://www.youtube.com/embed/TJsjlOik0QU" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/FILENAME.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true muted=true loop=true %}
    </div>
</div>
```

---

### People page - `_pages/people.md`

This page shows a list of all the current PhD students, postdocs, visitors and alumni. To remove people's profiles, look for the relevant file and image pair in the markdown file, and delete those lines. Then, also delete the profile picture from `/assets/img/people` and delete the relevant profile markdown file from the `_pages/people/phdstudents` or `_pages/people/postdocs` folder. Conversely, to add a profile, look for the correct section header in the markdown file, and add the following lines:
```yaml
- align: left 
  image: people/NAME.jpeg
  content: people/phdstudents/about_NAME.md
```
For the image, it's important that no two images have the same filename, otherwise ImageMagick will whine about it. So, if two people have the same last name, it's also possible to rename the image to `LASTNAME_F` to avoid this conflict. Just make sure the image name in `/assets/img/people/` syncs with whatever is entered in the file above. Of course, that also requires uploading the image! 

Finally, create a new markdown file in the relevant `_pages/_people` folder; `ABOUT_LASTNAME.md` in the `phdstudents` folder is a good example of what this file should look like:
```markdown
**Firstname Lastname**  
*Title in Department*  
Ph.D. University, 20XX  
M.S. University, 20XX  
B.S. University, 20XX

Name's primary research interests include one, two, and three. Outside of lab, he/she/they enjoy(s) one and two.

[email](mailto:@youremail@stanford.edu) \| [google scholar](url_of_your_googlescholar_here)
```

To update the visitor and alumni lists, simply edit `about_visitors.md` and `about_alumni.md`. Likewise, to edit Matthias' profile, just edit `about_ihme.md`.

***TODO: I think it's possible to convert this page to a collections-based structure so that maintainer only needs to add the person's markdown file. But I'll think about this at a more opportune time, it's fine for now.***

---

### Publications page - `_pages/publications.md`

This page displays a list of all the publications from the lab and is automatically generated from the `papers.bib` file in `_bibliography`. This makes it easy to add new publications to the website, just remember to rebuild before pushing to production. Note that in order for the entry to display correctly, it is recommended that author names are given in full (not initials). Also, the `month` and `year` fields should be filled in; if it is desired to include the abstract in the dropdown box, then also specify the `abstract` field. Finally, the DOI field should not contain `https://doi.org/` prefix, just put the DOI itself not the URL.

You can also add new `*.bib` files and customize the look of your publications however you like by editing [\_pages/publications.md](_pages/publications.md). By default, the publications will be sorted by year and the most recent will be displayed first. You can change this behavior and more in the `Jekyll Scholar` section in [\_config.yml](_config.yml) file.

---

### Teaching page - `_pages/teaching.html`

This page displays a list of all the Stanford courses that Matthias teaches and is automatically generated based on the contents in `_teaching` folder. To add courses, just copy one of the existing markdown files and edit. Three keywords are available in the preamble: 
```yaml
title: #The course title, in double quotation marks
explorecourses: #The link to Stanford ExploreCourses with more info, also in double quotation marks
coursereader: #Coursereader file name in /assets/pdf
```
The title is a mandatory keyword, the other two are optional. For the description, it is simply the content of the markdown file.

---

### Contact page - `_pages/contact.md`

Self-explanatory. Simply edit the markdown file.

---

### Adding more pages

At some point I'm sure Matthias will want more stuff on the website. That's fine (and fairly easy) because Jekyll is awesome. To add another page, simply go to the `_pages` folder, make a new markdown/HTML file, and add a preamble like this one:
```yaml
---
layout: page
permalink: /URL_HERE
title: PAGE TITLE HERE
description: OPTIONAL
nav: true
nav_order: 99
---
```
The `nav` keyword determines whether the page is included in the top navigation bar (most likely you'll want to set this to `true`), and the `nav_order` determines where it goes (higher number is lower priority, i.e. if you want it furthest left you'll set it to like `1` or something; may need to change the `nav_order` in the currently-existing pages). The `permalink` refers to the page address and `title`/`description` are... well, the page title and page description. The `page` layout is the default for every page that doesn't need specialized structure like the homepage (`about`) or research page (`research`), it's rather versatile and renders markdown perfectly well. If you want some specific styles for this page only, you can add the `_styles` keyword to the preamble and type CSS class rules.

---

### Other features

#### Full support for math & code

**al-folio** supports fast math typesetting through [MathJax](https://www.mathjax.org/) and code syntax highlighting using [GitHub style](https://github.com/jwarby/jekyll-pygments-themes). Also supports [chartjs charts](https://www.chartjs.org/), [mermaid diagrams](https://mermaid-js.github.io/mermaid/#/), and [TikZ figures](https://tikzjax.com/).

#### Photos, Audio, Video and more

Photo formatting is made simple using [Bootstrap's grid system](https://getbootstrap.com/docs/4.4/layout/grid/). Easily create beautiful grids within your blog posts and project pages, also with support for [video](https://alshedivat.github.io/al-folio/blog/2023/videos/) and [audio](https://alshedivat.github.io/al-folio/blog/2023/audios/) embeds.

#### Social media previews

**al-folio** supports preview images on social media. To enable this functionality you will need to set `serve_og_meta` to `true` in your [\_config.yml](_config.yml). Once you have done so, all your site's pages will include Open Graph data in the HTML head element.

You will then need to configure what image to display in your site's social media previews. This can be configured on a per-page basis, by setting the `og_image` page variable. If for an individual page this variable is not set, then the theme will fall back to a site-wide `og_image` variable, configurable in your [\_config.yml](_config.yml). In both the page-specific and site-wide cases, the `og_image` variable needs to hold the URL for the image you wish to display in social media previews.

---

## License

The al-folio theme is available as open source under the terms of the [MIT License](https://github.com/alshedivat/al-folio/blob/master/LICENSE).

Originally, **al-folio** was based on the [\*folio theme](https://github.com/bogoli/-folio) (published by [Lia Bogoev](https://liabogoev.com) and under the MIT license). Since then, it got a full re-write of the styles and many additional cool features.

To adhere with the MIT license terms as above, this code is also made available as open source via Github.

## To-do list

* Solicit writeups for capabilities page
* Solicit projects (images and writeups) from labmates
* Cross-browser testing and compatibility checks
