import mongoose from 'mongoose'

const FieldSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true
  },

  label: {
    type: String,
    required: true
  },

  helperText: String,

  type: {
    type: String,
    enum: [
      "text", "number", "textarea", "radio", "checkbox",
      "select", "date", "yesno", "table", "file"
    ],
    required: true
  },

  required: {
    type: Boolean,
    default: false
  },

  options: [
    {
      label: String,
      value: String
    }
  ],

  validation: {
    min: Number,
    max: Number,
    regex: String
  },

  ui: {
    placeholder: String,
    unit: String,
    order: Number
  },

    visibilityScope: {
      type: [String],
      enum: ["admin", "professional", "customer"],
      default: ["professional"]
    },

  editable: {
    afterSubmit: {
      type: Boolean,
      default: false
    },
  }
})

const SectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {type: String},

  order: {type: Number},

  fields: [FieldSchema]
})


const FormSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true           // electrician_pricing_v1
  },

  purpose: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {type: String},

  target: {
    entity: {
      type: String,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "target.entity"
    }
  },

  version: {
    type: Number,
    default: 1
  },

  isActive: {
    type: Boolean,
    default: true
  },

  sections: [SectionSchema]

}, { timestamps: true })

export const Form = mongoose.model('Form', FormSchema);