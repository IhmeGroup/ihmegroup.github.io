---
layout: page
title: Computational
description:
img: /assets/img/comp2.jpeg
importance: 2
category: lab
related_publications: true
_styles: >
  .row.dg img {height:100%; object-fit:contain; background:white;}
  .row.charlesx img {height:100%; object-fit:cover;}
  .row.dg figure, .row.charlesx figure {height:100%; padding-bottom: 1rem;}

  @media only screen and (max-width:576px){
    .row.dg .col-sm:nth-of-type(even){
      display:none;
    }
  }
---

## Large-Eddy Combustion Simulations with CharLES<sub>x</sub>

CharLES<sub>x</sub> is the FX Lab’s primary large eddy simulation (LES) solver. It uses the finite volume method to solve the fully compressible Navier-Stokes equations and has a multitude of capabilities which make it well-suited to both fundamental research and applied engineering problems.

<div class="row charlesx">
  <div class="col-sm mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/charlesx.png" title="Turbulent combustor simulation" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/injection.png" title="High pressure diesel injection" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

### Features

#### Performance:
* Massively parallel, scaling to hundreds of thousands of CPU cores
* Automatic mesh partitioning
* Dynamic load rebalancing in finite-rate chemistry and PEC simulations

#### Numerics:
* Structured and unstructured mesh support
* Low-dissipation numerics and NSCBC boundary conditions for accurate acoustic treatment
* Split schemes with semi-implicit integration of stiff ODE systems
* Shock capturing
* Wall models

#### State-of-the-art combustion modeling:
* Finite rate chemistry
* Multiple tabulated chemistry models
* PEC, the fidelity-adaptive chemistry framework
* Radiative heat loss
* Advanced flow physics capabilities:
* Real fluid equations of state for transcritical and supercritical flows
* Lagrangian spray particles for multiphase flows

---

## Discontinuous Galerkin Methods

Discontinuous Galerkin (DG) methods offer high orders of accuracy with good numerical dispersion and dissipation properties, especially on unstructured grids. They provide geometric flexibility and *hp*-adaptability, which allows different orders of accuracy to be used in different solution regions for better accuracy. This allows DG solvers to better capture small scale flow structures, flame fronts, and other features common in turbulent reacting flows.

Quail {% cite ching_quail_2022 %} is a lightweight, [open-source](https://github.com/ihmegroup/quail) discontinuous Galerkin code written in-house for teaching and prototyping. Vectorized Python operations are used to improve the computational efficiency while retaining code clarity and modularity. Currently, Quail solves first-order and second-order nonlinear systems of partial differential equations common to the flow physics problems tackled in the lab.

<div class="row dg">
  <div class="col-sm mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/quail1.png" title="Taylor-Green vortex" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/jax_dg_vortex.gif" title="Isentropic vortex propagating in square domain" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/quail2.png" title="Flow over Gaussian bump" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

---

## Machine Learning

Machine learning and other data-driven techniques present a wide range of opportunity to augment high-fidelity numerical simulations of complex turbulent and/or reacting flows, which require high temporal and spatial resolutions to capture salient features of the flow.

[BLASTNet](https://blastnet.github.io) (**B**earable **L**arge **A**ccessible **S**cientific **T**raining **Net**work-of-Datasets) {% cite 10.5555/3666122.3669508 %} aims to address gaps in open machine learning within the fluid mechanics community by providing researchers with externally-contributed open-source high-fidelity reacting and non-reacting flow data. These contributions curated by the lab now include several terabytes of high-fidelity numerical simulation data that have been processed in a convenient format for machine learning applications, pre-trained model weights, and thousands of lines of code to aid in model training and evaluation.

---

## GPU and TPU Computing



---
