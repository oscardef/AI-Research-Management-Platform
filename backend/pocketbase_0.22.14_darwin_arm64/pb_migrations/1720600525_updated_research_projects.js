/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nbmsavy15hmjaw7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xmf5xpfq",
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
  const collection = dao.findCollectionByNameOrId("nbmsavy15hmjaw7")

  // remove
  collection.schema.removeField("xmf5xpfq")

  return dao.saveCollection(collection)
})
