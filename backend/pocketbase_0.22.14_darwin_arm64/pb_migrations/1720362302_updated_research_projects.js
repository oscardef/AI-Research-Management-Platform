/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nbmsavy15hmjaw7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3uxn8cwl",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Active",
        "Inactive",
        "Complete",
        "Pending"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nbmsavy15hmjaw7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3uxn8cwl",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "active",
        "inactive",
        "complete",
        "other"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
