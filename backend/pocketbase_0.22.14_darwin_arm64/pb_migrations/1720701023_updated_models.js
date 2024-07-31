/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j0yx9monjjaemwa")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4xjb5t8r",
    "name": "related_models",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "j0yx9monjjaemwa",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j0yx9monjjaemwa")

  // remove
  collection.schema.removeField("4xjb5t8r")

  return dao.saveCollection(collection)
})
