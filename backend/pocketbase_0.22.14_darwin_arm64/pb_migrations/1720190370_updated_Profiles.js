/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("udn729og8o5agem")

  collection.name = "profiles"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("udn729og8o5agem")

  collection.name = "Profiles"

  return dao.saveCollection(collection)
})
