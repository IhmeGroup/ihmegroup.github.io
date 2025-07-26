---
layout: page
img: /assets/img/projects/multiphase.png
title: Multiphase flow dynamics
importance: 99
category: energy
related_publications: true
---

Interactions between liquid and vapor media are prominent in modern engineering systems such as combustion engines, cooling systems, and chemical reactors. The complex interactions between phases pose significant challenges for accurate mathematical modeling and simulation.

At FxLab, we focus on developing advanced methods for simulating multiphase flows using a unified formulation {% cite ly2024regularized %} that emphasizes thermodynamic consistency between the liquid and vapor phases. The vapor-liquid phase-change regimes near critical conditions are modeled using cubic, real-fluid equations of state (EOS) {% cite ma_entropy-stable_2017 %}. Addressing the physical effects across the interface, we employ a phase-field approach based on the diffuse interface theory of van der Waals to model these interfacial effects that are consistent with the vapor-liquid equilibrium in all temperatures and pressures. 

This approach allows us to capture the intricate dynamics of phase transitions and interactions, providing a robust framework for simulating multiphase flows in various engineering applications. Our methods have been applied to a range of problems, including liquid injection in combustion engines {% cite ly2024importance %}, shocks {% cite doi:10.2514/6.2025-1502 %}, and cooling systems.

