
figma.showUI(__html__,{ themeColors: true});
figma.ui.resize(350,200);


figma.on('selectionchange', () => {

  if (figma.currentPage.selection.length > 0) {
    for (const node of figma.currentPage.selection) {
      if (node.type === 'COMPONENT') {
        figma.ui.postMessage('Component selected');
      } else {
        figma.ui.postMessage('Please only select components');
      }
    }
  } else {
    figma.ui.postMessage('Nothing selected');
  }
 
  
})

const showNotification = () => {
  
  const amountOfNodesSelected = figma.currentPage.selection.length

  if (amountOfNodesSelected > 1) {
    figma.notify(`${amountOfNodesSelected} components updated.`, {
      timeout: 1000
    })
  } else {
    figma.notify(`${amountOfNodesSelected} component updated.`, {
      timeout: 1000
    })
  }
}

function updateDocumentation(data) {

 
      for (const node of figma.currentPage.selection) {

        if (node.type !== 'COMPONENT') {
          figma.notify("You must select a component.", { error: true })
          return
        }

        if (!data) {
          node.documentationLinks = []
          showNotification()
        }

        node.documentationLinks = [{uri: data}]
        showNotification()

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




 
