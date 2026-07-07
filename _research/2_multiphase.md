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
    <img src="/assets/img/mphero.png" alt="Experimental shadowgraphy snapshots of a fuel droplet undergoing transcritical transition">
    <p><i>Figure: Experimental snapshots of the transcritical transition of a slow-moving fuel droplet.</i></p>
  </div>

  <div class="research-detail-top__text">
    <p>
      Many propulsion and energy systems operate at pressures near or above the critical point of their fuels and combustion products, where the clean distinction between liquid and gas breaks down. Under these conditions, real-fluid thermodynamics, phase separation, and interfacial dynamics govern how fuels mix, evaporate, and ignite. We study these multiphase and real-fluid interactions through theory, high-fidelity simulation, and experiment, developing the models needed to predict mixing and combustion in the next generation of power-generation devices.
    </p>
    <p>
      Our activities in this area center around the following:
      <ul>
        <li><ins>Real-fluid thermodynamics and phase behavior:</ins> Characterizing how phase separation, species immiscibility, and sharp property variations across the Widom line govern evaporation, mixing, and stability at transcritical and supercritical pressures.</li>
        <li><ins>Unified interface-resolving methods:</ins> Developing numerical methods, such as the regularized interface method (RIM), to capture complex interfacial and mixing dynamics for high-pressure multiphase flows.</li>
        <li><ins>Fuel injection and spray dynamics:</ins> Performing large-eddy simulations of turbulent sprays and propellant mixing layers to predict ignition and combustion-instability behavior in engines.</li>
        <li><ins>Experiments and diagnostics:</ins> Using high-speed shadowgraphy and hot-surface ignition experiments to measure droplet breakup, evaporation, and stochastic ignition for both conventional and sustainable fuels.</li>
      </ul>
    </p>
  </div>
</div>

<!-- Bottom section -->
<div class="research-detail-bottom">

  <div class="research-detail-card">
    <img src="/assets/img/multiph1.png" alt="Interface-resolving simulation of a high-pressure multi-species mixing layer showing liquid and vapor phase separation">
    <h3>High-Pressure Multi-Species Phase Exchange</h3>
    <p>
      When immiscible fluids are injected into high-pressure environments, subcritical interfacial dynamics and supercritical mixing can coexist as temperature varies around the mixture's critical point. Resolving liquid and vapor interfaces significantly changes predicted atomization and mixing, effects that diffuse-interface models neglect.
    </p>
  </div>

  <div class="research-detail-card">
    <img src="/assets/img/multiph2.png" alt="Simulation of a shock wave passing through a water droplet, driving its interface into transcritical conditions">
    <h3>Shock Droplet Interaction</h3>
    <p>
      Modern high-pressure propulsion systems drive strong shocks through liquid droplets. Using RIM, we resolve how a shock can push a droplet interface into transcritical conditions, where the interface momentarily vanishes and re-emerges. These dynamics, typically neglected in engine simulations, influence mixing and combustion at elevated chamber pressures.
    </p>
  </div>

  <div class="research-detail-card">
    <video autoplay loop muted playsinline id="myVideo">
      <source src="/assets/video/hotsurf.mp4" type="video/mp4">
    </video>
    <h3>Hot Surface Ignition and Droplet Dynamics</h3>
    <p>
      When leaking fuel contacts a hot surface, its vapor can ignite and start a fire. We combine experiments and modeling to study this process: high-speed shadowgraphy captures how a droplet breaks up on impact, while stochastic low-order models predict the ignition probability and combustion dynamics.
    </p>
  </div>

</div>

</div>

<script>
  const video = document.getElementById('myVideo');
  video.playbackRate = 2.0;   // change to 1.0 for normal, 0.5 for half speed
</script>