---
layout: default
title: Data-Driven and ML-Enhanced Physical Modeling
img:  /assets/img/datadriven.png
align: bottom left
background: "#007C92"
text: "#000000"
grouping: datadriven
mode: light
---

<div class="research-detail-layout">

<!-- Top section -->
<div class="research-detail-top">
  <div class="research-detail-top__figure">
    <img src="/assets/img/nnfig.png" alt="A fully connected neural network with four features, 2 predictions, and three hidden layers.">
    <p><i>Figure: A fully connected neural network with four features, two predictions, and three hidden layers.</i></p>
  </div>

  <div class="research-detail-top__text">
    <p>
      Machine learning is reshaping how we model combustion and fluid systems, but reliable predictions require pairing data-driven methods with physical domain knowledge. We develop machine learning and AI approaches that learn from high-fidelity simulations, high-resolution experiments, and sensor data to improve predictive modeling, accelerate expensive computations, and extract new insight from data. Throughout, we emphasize methods that remain physically interpretable and generalizable, addressing the challenges of dimensionality, sparsity, and data scarcity inherent to scientific machine learning.
    </p>
    <p>
      Some core elements of our research program in this area include:
      <ul>
        <li><ins>Physics-informed and interpretable ML:</ins> Embedding physical constraints and extracting interpretable or symbolic expressions so that data-driven models remain generalizable and physically explainable.</li>
        <li><ins>Data assimilation and state estimation:</ins> Using ensemble Kalman methods to fuse sparse high-speed experimental measurements into high-fidelity simulations of transient combustion and detonation dynamics.</li>
        <li><ins>Scientific ML datasets and super-resolution:</ins> Developing large public benchmark datasets, such as <a href="https://blastnet.github.io/">BLASTNet</a>, together with deep learning methods for reconstructing compressible reacting flows.</li>
        <li><ins>ML-enhanced combustion closures and model assignment:</ins> Learning subgrid-scale and combustion submodels, and dynamically assigning models at simulation runtime, to reduce computational cost while improving accuracy over conventional closures.</li>
      </ul>
    </p>
  </div>
</div>

<!-- Bottom section -->
<div class="research-detail-bottom">

  <div class="research-detail-card">
    <img src="/assets/img/ml1.png" alt="Deep learning super-resolution reconstruction of a high-fidelity turbulent flow field">
    <h3>ML-enhanced model reconstruction</h3>
    <p>
      High-fidelity simulation and imaging of turbulent flows are limited by resolution and computational cost. We develop deep learning methods that reconstruct fine-scale flow structure from coarse data, showing how architecture, model size, and physics-based loss functions govern reconstruction accuracy.
    </p>
  </div>

  <div class="research-detail-card">
    <img src="/assets/img/rl1.png" alt="Reinforcement-learning active control suppressing thermoacoustic instability in a bluff-body flame">
    <h3>Reinforcement learning and active control</h3>
    <p>
      Thermoacoustic instabilities challenge the design and operation of combustion systems, and are increasingly important for next-generation combustors. We apply model-free deep reinforcement learning to adaptively tune active control systems, suppressing these instabilities across a wide range of operating conditions.
    </p>
  </div>

  <div class="research-detail-card">
    <img src="/assets/img/da1.png" alt="Data-assimilation reconstruction of a detonation wave structure from sparse imaging measurements">
    <h3>Data assimilation</h3>
    <p>
      Experimental diagnostics are sparse, while simulations provide full fields that gradually drift from reality. Data assimilation bridges the two, fusing limited high-speed measurements into high-fidelity simulations. We extend these methods to assimilating Schlieren and chemiluminescence images to reconstruct chaotic detonation phenomena.
    </p>
  </div>

</div>
