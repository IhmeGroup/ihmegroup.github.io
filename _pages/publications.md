---
layout: page
permalink: /publications/
title: Publications
description: "See <a href='https://scholar.google.com/citations?user=g1q2D9sAAAAJ&hl=en'>Google Scholar</a> for full updated list."
nav: true
nav_order: 4
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography %}

</div>

<script>
document.addEventListener('DOMContentLoaded',function(){
    // Script for sticky year
    document.querySelectorAll("h2.bibliography").forEach(function(e){
        e.innerHTML = '<span>'+e.innerHTML+'</span>';
    });
    // Script to add request paper button
    document.querySelectorAll('ol.bibliography > li > .row > div').forEach(function(e) {
      let title = encodeURIComponent(e.querySelectorAll('.title')[0].textContent);
      let linkBar = e.querySelectorAll('.links')[0];
      let newLink = document.createElement('a');
      newLink.classList += 'btn btn-sm z-depth-0'
      newLink.href = 'mailto:fxlab@gmail.com?subject=Requesting paper&body=Hi there,%0D%0AMay I request a copy of the paper "'+title+'" please?%0D%0AThank you!'
      newLink.innerHTML = 'Request paper'
      linkBar.appendChild(newLink)
    });
});
</script>
