export function generateEntityKey(type: string, id: string | number) {
  return `${type}_${id}`;
}

export function generateRelationKey(
  parentKey: string,
  type: string,
  childKey: string,
) {
  return `${parentKey}_${type.toLowerCase()}_${childKey}`;
}
