import { Message } from "ai"

export class MessageTreeNode {
  constructor(
    private readonly _message: Message | null = null, // null if root node
    private _parentNode: MessageTreeNode | null = null,
    private readonly _childNodes: MessageTreeNode[] = [],
  ) {}

  public getMessages(): Message[] {
    if (!this._parentNode || !this._message) return []
    return [...this._parentNode.getMessages(), this._message]
  }

  public createChild(message: Message): MessageTreeNode {
    const newNode = new MessageTreeNode(message, this)
    this._childNodes.push(newNode)
    return newNode
  }

  public popChild(): MessageTreeNode | undefined {
    const childNode = this._childNodes.pop()
    if (childNode) childNode._parentNode = null
    return childNode
  }

  public get parentNode(): MessageTreeNode | null {
    return this._parentNode
  }
}
