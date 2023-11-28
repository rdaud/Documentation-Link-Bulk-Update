
figma.showUI(__html__,{ themeColors: true});
figma.ui.resize(280,260);

interface NotificationOptions {
  timeout?: number;
  error?: boolean;
}

function checkNodesSelection() {

  const amountOfNodesSelected = figma.currentPage.selection.length

  // Check if any node is selected at all
  if (amountOfNodesSelected > 0) {
    // Check if node type is COMPONENT or COMPONENT_SET
    const array = figma.currentPage.selection
    const checkNodeType = (node) =>  node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
    const checkNodeTypeResult = array.every(checkNodeType)

    if (checkNodeTypeResult) {
      // If selection is allowed post a message
      figma.ui.postMessage({
        state: "SELECTION_ALLOWED",
        amount: array.length
      });
    } else {
      // If selection isn't allowed post a message
      figma.ui.postMessage({
        state: "SELECTION_NOT_ALLOWED"
      });
    }

    } else {
      // If nothing is selected, post a message
      figma.ui.postMessage({
        state: "NOTHING_SELECTED"
      });
    }
}

figma.on('run', () => {

  checkNodesSelection()
 
 })

figma.on('selectionchange', () => {

 checkNodesSelection()

})




const showNotification = () => {

  const amountOfNodesSelected = figma.currentPage.selection.length


  if (amountOfNodesSelected > 1) {
    figma.notify(`${amountOfNodesSelected} components updated!`, {
      timeout: 2000
    })
  } else {
    figma.notify(`${amountOfNodesSelected} component updated!`, {
      timeout: 2000
    })
  }
}

function updateDocumentation(data) {

    const { url } = data
    const array = figma.currentPage.selection

    // Check if node type is COMPONENT or COMPONENT_SET
    const checkNodeType = (node) =>  node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
    const checkNodeTypeResult = array.every(checkNodeType)
    
    if(!checkNodeTypeResult) {
      figma.notify("You must select only main components or components set!", { error: true })
      figma.ui.postMessage('Update failed');
      return
    }

    // Iterate in the current page selection
    for (const node of figma.currentPage.selection) { 
      if (node.type === 'COMPONENT_SET' || node.type === 'COMPONENT') {
          node.documentationLinks = !!url && [{uri: url}] || []
          figma.ui.postMessage('Update success');
          showNotification()
      }
    }
     
}

figma.ui.onmessage = msg => {

  if (msg.type === 'close') {
    figma.closePlugin()  
  }
  if (msg.type === 'apply') {
    updateDocumentation(msg.data)
  }
 
};




 
