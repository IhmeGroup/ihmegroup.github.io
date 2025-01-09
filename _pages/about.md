---
layout: about
title: about
permalink: /
subtitle: Laboratory of <span class="fx">F</span>luids in Comple<span class="fx">x</span> Environments
nav: false

news: false # includes a list of news items
selected_papers: false # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page
---

<!-- Write your biography here. Tell the world about yourself. Link to your favorite [subreddit](http://reddit.com). You can put a picture in, too. The code is already in, just name your picture `prof_pic.jpg` and put it in the `img/` folder.

Put your address / P.O. box / other info right below your picture. You can also disable any of these elements by editing `profile` property of the YAML header of your `_pages/about.md`. Edit `_bibliography/papers.bib` and Jekyll will render your [publications page](/al-folio/publications/) automatically.

Link to your social media connections, too. This theme is set up to use [Font Awesome icons](https://fontawesome.com/) and [Academicons](https://jpswalsh.github.io/academicons/), like the ones below. Add your Facebook, Twitter, LinkedIn, Google Scholar, or just disable all of them. -->

We are a part of the Mechanical Engineering department at Stanford University and Photon Science at the Stanford Linear Accelerator Center (SLAC). Our research aims to develop an improved holistic understanding of fluids in complex environments, with application to energy conversion, propulsion, wildfire modeling, and carbon capture and sequestration. To do so, we combine experimental, theoretical, and computational approaches. Current research activities at the lab include but are not limited to:

- ultrafast X-ray experiments to reveal fluid microstructure,
- large-scale molecular dynamics simulations to characterize macroscopic behavior, and
- large-eddy simulations of combustion systems, ranging from rocket engines to wildfires.

Learn more about our [research](/research). [Join us](/contact). Stay up to date with our latest work by following us on [X](https://twitter.com/fxlabstanford). 

<style>
.logo-section .row img {
    height: 100px; /* Set the height for all images */
    width: auto; /* Maintain aspect ratio */
    object-fit: contain; /* Ensure the image fits within the height */
}
</style>

<div class="post">

  <article class="large homepage">
    <!-- News -->
      <hr>
      <h2>
        <!--<a href="{{ '/news/' | relative_url }}" style="color: inherit">Announcements</a>-->
	Announcements
      </h2>
      {% include news.liquid limit=true %}
  </article>
</div>

<br>

<div class="logo-section">
    <div class="row">
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/doe_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/acs_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/afosr_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/cmcuf_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/faa_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/nasa_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/nsf_logo.png" title="example image" class="img-fluid" %}
        </div>
    </div>
    <div class="row">
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/boeing_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/exxon_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/total_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/onr_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/google_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/daikin_logo.png" title="example image" class="img-fluid" %}
        </div>
    </div>
    <div class="row">
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/fmglobal_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/precourt_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/doerr_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/woods_logo.png" title="example image" class="img-fluid" %}
        </div>
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid loading="eager" path="assets/img/logos/psaap_logo.png" title="example image" class="img-fluid" %}
        </div>
    </div>
</div>