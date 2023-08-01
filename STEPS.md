# WORKFLOW BUILDER

## Steps Go Through

- 1. Creat the MAIN Builder Canvas Component.

  - Add Two button => `Save` & `Close`
  - Creat the `Parent Segment Box` which is root of the flow.
  - Create button to show Action/Decision

  ### Connecters Line & Dynamic Component Creation

- 2. Connections between Two nodes. How we are going to do it?
  - what should be connected! SVG / HTML CANVAS Line Element?
    - If it is SVG ?!
      - Need R&D for SVG (Go for svg)
    - If is is HTML CANVAS
      - Need R&D for HTML CANVAS
  - Connections between parent/main segment root to a child component
  - Connections between child components to child components
  - Move the connecters between two nodes/components. while a child component move the connecter between its child components will also move
  - Remove a connecter line when child node is removed
  - Remove all the connecters of multiple child components while parent node is removed.
- 3. Create `Dynamic Components From ROOT`
  - Create Conntector from ROOT to Newly Created Component
  - Set position of Dynamic Component which are created from root
  - Create button to show Action/Decision
- 4. Create `Dynamic Components From Newly Created Dynamic Components`

  - Create Conntector from Dynamic Component to Newly Created Component
  - Set position of Dynamic Component which are created from another Dynamic Component
  - Create button to show Action/Decision

  ### Dynamic Components Positioning

- 5. Parent Components positioning (Those are created from `Segemt/Root` Node)

  - Position will start from the middle of Viewport then tosition goes towards left of View
  - dasd

  ### Modal

- 6. Create Popup/Modal For `Action` & `Decision`.
  - Create/Show modal with config options to select action/decision
  - Action/Decision conditional rendering
- 7. How to remove connector from child when `Parent is removed`

## LINK For Node-Data `https://stackblitz.com/edit/js-lmurru?file=index.js`

## LINK for Modified Node-Rule `https://stackblitz.com/edit/js-uczkr2?file=index.js`

## LINK for testing with backend data `https://stackblitz.com/edit/js-qrxqkq?file=index.js`

## LINK For EDIT `https://stackblitz.com/edit/js-kvhvus?file=index.js`
