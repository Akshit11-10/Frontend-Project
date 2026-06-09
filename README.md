# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.







-----------------------------------==================================PROJECT EXPLAINATION--------------------------------------==========================================


# DIST
--dist(distribution)-final website yhn pe store hoti hai (or ye tb bnta hai jb npm run dev run hoti hai) , or jo eske andr file hoti hai vo random esliye hoti hai kynki vo tb bnti hai jb website run hoti hai. 
# Random names of files inside dist folder--bcoz of cache optimization.

# Public
Direct browser accessible files.


# Library kya hoti?--Dusro ka likha ready-made code.Taaki hume sab scratch se na banana pade.



# npm(Node Package Manager)-It is used to install lib/packpages or dependencies and to run scripts.


# import React from "react" -- string kyu? coz it is Package name.


SVG = scalable vector graphics.


# React app ka flow:
Browser
   ↓
main.jsx
   ↓
App.jsx
   ↓
Pages
   ↓
Components
   ↓
Rendered UI



# StrictMode - React ka ek development tool hai, Code me possible problems aur bad practices ko detect karna.  StrictMode React ka debugging/helper mode hai jo development me code ki problems dhoondhne me madad karta hai.



# react and reactDom - react(normal ui banana), reactDom(browser mei ui dikhana)