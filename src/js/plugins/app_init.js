 // Creation of App object with the functions we need to run the JavaScript app.

const App = {
  loading: false,
  contracts: {},

  load: async () => {
    App.loadWeb3()
    await App.loadAccount()
    await App.loadContracts()
    await App.render()
    await App.renderICO()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account in the wallet
    App.account = web3.eth.accounts[0]
  },

  loadContracts: async () => {
    // Create a JavaScript version of the smart contract DappTokenSale
    const dappTokenSale = await $.getJSON('DappTokenSale.json')      // contract Name we want to get
    App.contracts.DappTokenSale = TruffleContract(dappTokenSale)     // API call to the blockchain
    App.contracts.DappTokenSale.setProvider(App.web3Provider)
    App.dappTokenSale = await App.contracts.DappTokenSale.deployed() // Hydrate the smart contract with values from the blockchain

    // We do the same
    const dappToken = await $.getJSON('DappToken.json')
    App.contracts.DappToken = TruffleContract(dappToken)
    App.contracts.DappToken.setProvider(App.web3Provider)
    App.dappToken = await App.contracts.DappToken.deployed()
  },

  render: async () => {
    if (App.loading) {               // Prevent double render
      return 
    }
    App.setLoading(true)             // Update app loading status by triggering the setLoading function to update what we show in html
    await App.loadContracts()        // Render Tokens by triggering both DappToken and DppTokenSale contracts
    App.setLoading(false)            // Update loading state
  },

  renderICO: async () => {
    // DappToken
    var tokenInitialSupply = await App.dappToken.totalSupply().then(function(supplyInstance){return supplyInstance.toNumber()})
    var tokenName = await App.dappToken.name()
    var tokenSymbol = await App.dappToken.symbol()
    // var tokenStandard = await App.dappToken.standard()

    // DappTokenSale
    var tokenPrice = await App.dappTokenSale.tokenPrice().then(function(priceInstance){return web3.fromWei(priceInstance.toNumber())})  // web3.fromWei() is a library that converts in ETH
    var tokenSold = await App.dappTokenSale.tokenSold().then(function(tokenSoldInstance){return tokenSoldInstance.toNumber()})
    
    var remainingTokens = tokenInitialSupply - tokenSold


    // inject in html
    $('#accountAddress').html(App.account)
    $('#token-price').html(tokenPrice) 
    $('#token-name').html(tokenName) 
    $('#remaining-tokens').html(remainingTokens)
    $('#initial-token-supply').html(tokenInitialSupply)



    // const tokenSymbol = $('#symbol')
    // const tokenStandard = $('#standard')




    // const totalTokens = await App.dappToken
    // const tokenName   = await App.dappToken

    // console.log(App.dappToken)
    

    // const taskCount = await App.todoList.taskCount()    // Load the total task count from the blockchain
    // const $taskTemplate = $('.taskTemplate')

    // // Render out each task with a new task template
    // for (var i = 1; i <= taskCount; i++) {
    //   // Fetch the task data from the blockchain
    //   const task = await App.todoList.tasks(i)
    //   const taskId = task[0].toNumber()
    //   const taskContent = task[1]
    //   const taskCompleted = task[2]

    //   // Create the html for the task
    //   const $newTaskTemplate = $taskTemplate.clone()
    //   $newTaskTemplate.find('.content').html(taskContent)
    //   $newTaskTemplate.find('input')
    //                   .prop('name', taskId)
    //                   .prop('checked', taskCompleted)
    //                   // .on('click', App.toggleCompleted)

    //   // Put the task in the correct list
    //   if (taskCompleted) {
    //     $('#completedTaskList').append($newTaskTemplate)
    //   } else {
    //     $('#taskList').append($newTaskTemplate)
    //   }

    //   // Show the task
    //   $newTaskTemplate.show()
    // }
  },

  setLoading: (boolean) => {      // Updating load status to remove or display some content on the webpage
    App.loading   = boolean
    const loader  = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).on('load', function() {
    App.load()
  })
})