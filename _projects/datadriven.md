---
layout: page
title: Data-Driven Methods
description: whaa
img: assets/img/12.jpg
importance: 1
category: work
related_publications: true
---

Large Scale ML Resources

 
To address gaps in open machine learning (ML) within fluid mechanics, we developed the BLASTNet database, providing researchers in reacting and non-reacting flow physics communities with (mostly) externally contributed open-source ML resources. This data is useful for fluid flows in a wide range of ML applications tied to automotive, propulsion, energy, and the environment. Specifically, scientific engineering tasks related to these domains may include turbulent closure modeling, spatio-temporal modeling, and inverse modeling.

These contributions now include:

- 4.8 TB of high-fidelity simulation datasets that have been processed in a convenient format for ML applications,
- 13,000 lines of code that aid the training and evaluating of these models, and
- 100 pre-trained weights in flow physics problems.

More information can be found at https://blastnet.github.io/.


Turbulent Super-Resolution via Deep Learning

 
We conducted one of the first detailed and reproducible benchmark studies comparing deep learning-based super-resolution models for 3D turbulent flows with an open public dataset.

In many practical engineering analyses, large-eddy simulations (LES) with under-resolved grid sizes are often used to bypass the extensive costs of fully-resolved direct numerical simulations (DNS). Super-resolution has been proposed as a versatile alternative for correcting under-resolved information from. To this end, we benchmarked the performance and cost of:

- Residual-in-Residual Dense Block  (RRDB) Network,
- Enhanced Deep Residual Super-resolution (EDSR) Network,
- Residual Channel Attention Networks (RCAN),
- Convolutional Fourier Neural Operator model, and
- an RRDB model with a physics-based loss.

See detailed results here: https://arxiv.org/abs/2309.13457