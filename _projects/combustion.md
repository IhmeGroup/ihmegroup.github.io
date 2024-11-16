---
layout: page
title: Turbulent Combustion
description: whaa
img: assets/img/12.jpg
importance: 4
category: work
related_publications: true
---

Adaptive Combustion Modeling


Despite significant progress in combustion modeling, considerable challenges remain in the mathematical description and the simulation of chemically reacting turbulent flows. Usually the selection of an appropriate combustion model for the numerical prediction of reacting flows is carried out using expert knowledge or experimental data, while the computational cost that is associated with the available combustion models introduces a further constraint. By addressing these issues, the Pareto-efficient combustion (PEC) framework has been developed, which can be applied to complex reacting flows uder consideration of user-specific inputs about the quantities of interest, desired simulation accuracy and computational cost given a set of combustion models. Based on those constraints, PEC has the ability to dynamically select the appropriate local combustion model assignment.

Applying the PEC framework to complex systems such as gas turbine engines and rocket thrust chambers allows for the accurate estimation of performance-defining  parameters with a minimal cost. Quantities of interest for the engine design such as CO and CO2 emissions, NOx formation, and wall heat fluxes are included in the PEC framework allowing for precise yet computationally efficient predictions. PEC has been developed and applied in the following (non-exhaustive) list of works:

Introduction of the model and application to a laminar tribrachial flame: Wu et al. 2015
Application to a piloted DME jet flame for improved prediction of CO emissions: Wu et al. 2019
Development of "processes of interest" and application to transient ignition dynamics: Douasbin et al. 2021
Extension to spray combustion and application to a gas turbine combustor: Mohaddes et al. 2023
High-Pressure Diesel Injection

 
Modern internal combustion engines typically operate under pressure and temperature conditions that exceed the thermodynamic critical limits of the in-cylinder gas. In diesel engines, the injection of liquid fuel at supercritical pressure and subcritical temperature into a supercritical combustion chamber introduces complex thermophysical phenomena that are currently not well understood.

These conditions may allow atomization phenomena to be suppressed, with phase transition were to be dominated by diffusive mixing. These conditions can be described by diffuse-interface methods since sharp interfaces are no longer present. Instead of resolving liquid-vapor interfaces, these diffuse-interface methods treat fluid properties between liquid and gaseous regimes as a smooth function. 

The diffuse-interface method is here used with a compressible LES solver that also incorporates real-fluid effects and finite-rate chemistry, in order to simulate high pressure diesel spray combustion under various Engine Combustion Network (ECN) configurations. The ECN is an international collaboration among experimental and computational researchers from various institutions that focuses on improving scientific understanding of engine combustion.

Simulation results from previous studies that utilize this framework have successfully predicted essential spray characteristics such as spray liquid and vapor lengths, along with ignition delay and flame lift-off lengths.