---
layout: page
title: Wildfire Science
description: whaa
img: assets/img/12.jpg
importance: 2
category: work
related_publications: true
---

The increasing incidence and severity of wildfires underscores the necessity of accurately predicting their behavior. While high-fidelity models derived from first principles offer physical accuracy, they are too computationally expensive for use in real-time fire response. Low-fidelity models sacrifice some physical accuracy and generalizability via the integration of empirical measurements, but enable real-time simulations for operational use in fire response. Machine learning techniques have demonstrated the ability to bridge these objectives by learning first-principles physics while achieving computational speedups. While deep learning approaches have demonstrated the ability to predict wildfire propagation over large time periods, time-resolved fire spread predictions are needed for active fire management. In this work, we evaluate the ability of deep learning approaches in accurately modeling the time resolved dynamics of wildfires. We use an autoregressive process in which a convolutional recurrent deep learning model makes predictions that propagate a wildfire over 15 min increments. We apply the model to four simulated datasets of increasing complexity, containing both field fires with homogeneous fuel distribution as well as real-world topologies sampled from the California region of the United States. We show that even after 100 autoregressive predictions representing more than 24 h of simulated fire spread, the resulting models generate stable and realistic propagation dynamics, achieving a Jaccard score between 0.89 and 0.94 when predicting the resulting fire scar. For more information, see Burge et al. 2023.