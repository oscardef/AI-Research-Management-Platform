/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nbmsavy15hmjaw7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "siqsxnkq",
    "name": "related_projects",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "nbmsavy15hmjaw7",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wc2nlpjj",
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
  const collection = dao.findCollectionByNameOrId("nbmsavy15hmjaw7")

  // remove
  collection.schema.removeField("siqsxnkq")

  // remove
  collection.schema.removeField("wc2nlpjj")

  return dao.saveCollection(collection)
})
