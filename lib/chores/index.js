'use strict'

var uuid = require('node-uuid').v4

module.exports = function (options) {
  return new Chores(options)
}

var Chores = function (options) {
  options = options || {}
  if (!Array.isArray(options.chores)) {
    throw new Error('No chores provided')
  }
  if (!Array.isArray(options.members)) {
    throw new Error('No members provided')
  }

  this.chores = []
  this.available = []
  this.assigned = {}
  this.members = []

  this.init(options.chores, options.members)
}

Chores.prototype = {

  init: function (chores, members) {
    this.addChores(chores)
    this.members = members.map(function (member) {
      return member.trim().toLowerCase()
    })
    this.resetChores()

    return this
  },

  isMember: function (member) {
    return this.members.indexOf(member) !== -1
  },

  resetChores: function () {
    this.available = this.chores.slice(0)

    return this
  },

  resetAssigned: function () {
    this.assigned = {}

    return this
  },

  addChores: function (chores) {
    this.chores = chores.map(function (name) {
      return new Chore(name.trim())
    })

    return this
  },

  suggest: function () {
    // If we ran out of available chores, reset with all chores
    if (this.available.length === 0) {
      this.resetChores()
    }

    var chore = this.available[Math.floor(Math.random() * this.available.length)]

    if (this.isAssigned(chore.id)) {
      return this.suggest()
    }

    return chore
  },

  assign: function (member, choreId, done) {
    var chore = this.getChore(choreId)

    if (!chore) {
      throw new Error('Chore does not exist')
    }

    if (!this.isAvailable(choreId)) {
      throw new Error('Chore is not available')
    }

    if (this.isAssigned(choreId)) {
      throw new Error('Chore is already assigned')
    }

    if (this.hasChore(member)) {
      throw new Error('Member already has a chore')
    }

    this.assigned[member] = chore

    this.available = this.available.filter(function (chore) {
      return chore.id !== choreId
    })

    return this
  },

  complete: function (member) {
    delete this.assigned[member]

    return this
  },

  isAvailable: function (choreId) {
    var chore = this.available.filter(function (chore) {
      return chore.id === choreId
    })[0]

    return chore !== undefined
  },

  isAssigned: function (choreId) {
    var self = this

    var assigned = Object.keys(this.assigned).filter(function (member) {
      var chore = self.assigned[member]

      return chore.id === choreId
    })[0]

    return assigned !== undefined
  },

  hasChore: function (member) {
    return this.assigned[member] !== undefined
  },

  getChore: function (choreId) {
    return this.chores.filter(function (chore) {
      return chore.id === choreId
    })[0]
  }
}

var Chore = function (name) {
  this.id = uuid()
  this.name = name
}
