# WORKFLOW BUILDER

## Steps Go Through

### Canvas

- 1. Creat the MAIN Builder Canvas Component.
  - Add Two button => `Save` & `Close`
  - Creat the `Parent Segment Box` which is root of the flow.
  - Create button to show Action/Decision
- 2. Connections between Two nodes. How we are going to do it?
  - what should be connected! SVG / HTML CANVAS Line Element?
    - If it is SVG ?!
      - Need R&D for SVG (Go for svg)
    - If is is HTML CANVAS
      - Need R&D for HTML CANVAS
- 3. Create `Dynamic Components From ROOT`
  - Create Conntector from ROOT to Newly Created Component
  - Set position of Dynamic Component which are created from root
  - Create button to show Action/Decision
- 4. Create `Dynamic Components From Newly Created Dynamic Components`
  - Create Conntector from Dynamic Component to Newly Created Component
  - Set position of Dynamic Component which are created from another Dynamic Component
  - Create button to show Action/Decision
- 5. Create Popup/Modal For `Action` & `Decision`.
  - Create/Show modal with config options to select action/decision
  - Action/Decision conditional rendering
- 6. How to remove connector from child when `Parent is removed`
