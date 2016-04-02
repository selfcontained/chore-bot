'use strict'

var assert = require('chai').assert
var Chores = require('../index')

describe('Chores', function () {
  var options = {
    members: [
      'devin',
      'reese',
      'asher'
    ],
    chores: [
      'clean bathrooms',
      'do dishes',
      'vacuum wood',
      'vacuum carpet',
      'cleanup main floor'
    ]
  }

  it('Should not init w/o required fields', function () {
    assert.throws(Chores)
  })

  it('Should init w/ required fields', function () {
    var chores = Chores(options)

    assert.isObject(chores)
    assert.lengthOf(chores.members, options.members.length)
    assert.lengthOf(chores.chores, options.chores.length)
    assert.lengthOf(chores.available, options.chores.length)
    assert.lengthOf(Object.keys(chores.assigned), 0)
  })

  it('Should trim values and lowercase names', function () {
    var chores = Chores({
      members: [
        ' Devin '
      ],
      chores: [
        '    do something  '
      ]
    })

    assert.equal(chores.members[0], 'devin')
    assert.equal(chores.chores[0].name, 'do something')
  })

  it('Should suggest a chore', function () {
    var chores = Chores(options)

    var chore = chores.suggest()

    assert.isString(chore.id)
    assert.isString(chore.name)
  })

  it('Should assign a chore to a member', function () {
    var chores = Chores(options)

    var chore = chores.suggest()

    assert.doesNotThrow(function () {
      chores.assign('devin', chore.id)
    })

    assert.lengthOf(Object.keys(chores.assigned), 1)
    assert.lengthOf(chores.available, options.chores.length - 1)

    assert.isFalse(chores.isAvailable(chore.id))
    assert.isTrue(chores.isAssigned(chore.id))
  })

  it('Should allow a member to complete a chore', function () {
    var chores = Chores(options)

    var chore = chores.suggest()

    chores.assign('devin', chore.id)
    chores.complete('devin')
    assert.isFalse(chores.hasChore('devin'))
    assert.isFalse(chores.isAssigned(chore.id))
  })

  it('Should not assign a chore to the same person twice', function () {
    var chores = Chores(options)

    var chore1 = chores.suggest()
    chores.assign('devin', chore1.id)

    var chore2 = chores.suggest()
    assert.throws(function () {
      chores.assign('devin', chore2.id)
    })
  })

  it('Should assign a new chore to a 2nd member', function () {
    var chores = Chores(options)

    var chore1 = chores.suggest()
    chores.assign('devin', chore1.id)

    var chore2 = chores.suggest()
    assert.notEqual(chore2.id, chore1.id)

    chores.assign('reese', chore2.id)

    assert.lengthOf(Object.keys(chores.assigned), 2)
    assert.lengthOf(chores.available, options.chores.length - 2)

    assert.isFalse(chores.isAvailable(chore1.id))
    assert.isTrue(chores.isAssigned(chore1.id))

    assert.isFalse(chores.isAvailable(chore2.id))
    assert.isTrue(chores.isAssigned(chore2.id))
  })

  it('Should reset chores after all are complete', function () {
    var chores = Chores(options)

    var chore1 = chores.suggest()
    chores.assign('devin', chore1.id)

    var chore2 = chores.suggest()
    chores.assign('reese', chore2.id)

    var chore3 = chores.suggest()
    chores.assign('asher', chore3.id)

    assert.lengthOf(Object.keys(chores.assigned), 3)
    assert.lengthOf(chores.available, options.chores.length - 3)

    chores.complete('devin')
    chores.complete('reese')
    chores.complete('asher')

    assert.lengthOf(Object.keys(chores.assigned), 0)

    var chore4 = chores.suggest()
    chores.assign('devin', chore4.id)

    var chore5 = chores.suggest()
    chores.assign('reese', chore5.id)

    assert.lengthOf(Object.keys(chores.assigned), 2)
    assert.lengthOf(chores.available, 0)

    var chore6 = chores.suggest()

    assert.isTrue([chore1.id, chore2.id, chore3.id].indexOf(chore6.id) !== -1)
  })
})
