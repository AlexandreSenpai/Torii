enum Effect {
  ALLOW = 'allow',
  DENY = 'deny'
}

enum Action {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete'
}

interface PropField {
  [key: string]: {
    value: string
    expression: string
  }
}

type ActionField = {
  [key in Action]?: {
    value: string
    expression: string
  };
};

export interface PolicySchema {
  id:            string
  createdAt:     Date
  updatedAt:     Date
  name:          String
  description?:  String
  effect:        Effect
  actions:       ActionField
  subjects:      PropField
  resource:      PropField
  context:       PropField
};
