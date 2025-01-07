---
layout: page
permalink: /publications/
title: Publications
description: See <a href="https://scholar.google.com/citations?user=g1q2D9sAAAJ">Google Scholar</a> for full updated list.
nav: true
nav_order: 4
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography %}

</div>

<!-- Code for sticky year text -->
<script>
document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll("h2.bibliography").forEach(function(e){
        e.innerHTML = '<span>'+e.innerHTML+'</span>';
    });
});
</script>
