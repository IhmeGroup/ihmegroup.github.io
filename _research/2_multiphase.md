---
layout: default
title: Multiphase and Real-Fluid Interactions
img:  /assets/img/multiphase.png
align: left
padded: true
background: "#4298B5"
text: "#000000"
grouping: multiphase
mode: dark
---

<div class="research-detail-layout">

<!-- Top section -->
<div class="research-detail-top">
  <div class="research-detail-top__figure">
    <img src="/assets/img/projects/fig_insert.png" alt="Main figure for combustion research">
    <div class="research-detail-caption">
      Large-eddy simulation of a high-speed reacting flow with coupled shock and flame dynamics.
    </div>
  </div>

  <div class="research-detail-top__text">
    <p>
      Physics of phase transitions, interfacial dynamics, and high-pressure mixing.
      Multiscale interactions in supercritical fluids and complex thermodynamic regimes.
      Interface-resolving methods for transcritical and multiphase flow systems.
      Our work in advanced combustion systems and propulsion focuses on the physics and modeling of
      high-speed reacting flows, combustion instabilities, ignition, and next-generation propulsion
      concepts. We combine large-scale simulation, reduced-order modeling, data-driven methods, and
      theory to study systems ranging from scramjets and gas turbines to detonative combustion devices.
    </p>

    <p>
      Across these problems, we aim to connect fundamental flow physics to practical performance,
      stability, and design. This includes understanding how turbulence, shocks, chemistry, and
      heat release interact in extreme environments, as well as how computational and machine-learning
      tools can accelerate analysis and control.
    </p>
  </div>
</div>

<!-- Bottom section -->
<div class="research-detail-bottom">

  <div class="research-detail-card">
    <img src="/assets/img/multiph1.png" alt="Detonation dynamics figure">
    <h3>High-Pressure Multi-Species Phase Exchange</h3>
    <p>
      We study the structure, stability, and sensitivity of detonative combustion systems, with
      emphasis on unsteady wave dynamics, shock interactions, and the role of inhomogeneities.
    </p>
  </div>

  <div class="research-detail-card">
    <img src="/assets/img/multiph2.png" alt="Propulsion system figure">
    <h3>Shock Droplet Interaction</h3>
    <p>
      We investigate propulsion-relevant combustion in compressible and high-enthalpy environments,
      including ignition, mixing, and flameholding in advanced propulsion architectures.
    </p>
  </div>

  <div class="research-detail-card">
    <video autoplay loop muted playsinline id="myVideo">
      <source src="/assets/video/hotsurf.mp4" type="video/mp4">
    </video>
    <h3>Hot Surface Ignition and Droplet Dynamics</h3>
    <p>
      Our research examines thermoacoustic instability, direct and indirect combustion noise, and
      the mechanisms through which unsteady heat release couples to acoustic and entropy modes.
    </p>
  </div>

</div>

</div>

<script>
  const video = document.getElementById('myVideo');
  video.playbackRate = 2.0;   // change to 1.0 for normal, 0.5 for half speed
</script>