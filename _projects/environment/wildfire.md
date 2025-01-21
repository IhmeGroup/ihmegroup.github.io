---
layout: page
img: /assets/img/projects/fire_3.jpg
title: Wildfire Prediction and Simulation
importance: 99
category: environment
related_publications: true
---

Wildfires are becoming more [severe and frequent](https://doi.org/10.1098/rstb.2015.0178), driven in part by anthropogenic climate change. 
These devastating events not only result in [tragic loss of life](https://www.nifc.gov/) and property but also impose enormous economic costs. 
Accurately predicting the spread of wildfires remains a critical challenge, as [current fire behavior models](http://www.publish.csiro.au/?paper=WF06143) are largely empirical. 
These models, often calibrated for specific conditions, lack the generality needed to perform reliably when actual conditions deviate from their assumptions. 
The problem is especially pronounced in [regions of complex terrain](https://doi.org/10.1007/s10694-010-0193-6), where local flow patterns interact with the fire, altering its behavior in unpredictable and dangerous ways.

To address these challenges, our research at the FxLab focuses on developing a next-generation, open-source fire/atmosphere solver, [Swirl-LM/Swirl-FIRE](https://github.com/google-research/swirl-lm), capable of simulating wildfire spread in nearly real-time {% cite 10.1071/wf22225 %}.
Collaborating with Google Research, we leverage Tensor Processing Units (TPUs)--highly specialized processors designed for machine learning and scientific computing. 
Using [TensorFlow](https://www.tensorflow.org/) and just-in-time compilation, this advanced solver captures the critical physics of coupled fire/atmosphere interactions, enabling large-scale simulations that could transform our ability to predict and manage wildfires.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/fire_3.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true muted=true loop=true %}
    </div>
</div>

