/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j0yx9monjjaemwa")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cm7qn8om",
    "name": "public",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j0yx9monjjaemwa")

  // remove
  collection.schema.removeField("cm7qn8om")

  return dao.saveCollection(collection)
})
