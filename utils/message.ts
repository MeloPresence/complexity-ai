import { Message } from "ai"

export class MessageTreeNode {
  constructor(
    private readonly _message: Message | null = null, // null if root node
    private _parentNode: MessageTreeNode | null = null,
    private readonly _childNodes: MessageTreeNode[] = [],
  ) {}

  // Excludes the root, which has no message
  public getMessageNodePath(): MessageTreeNode[] {
    if (!this._parentNode || !this._message) return []
    return [...this._parentNode.getMessageNodePath(), this]
  }

  public getMessagesUpToThisNode(): Message[] {
    return this.getMessageNodePath().map((node) => node.getMessage()!)
  }

  public getLatestLeafNode(): MessageTreeNode {
    if (this._childNodes.length === 0) return this

    return this._childNodes.slice(-1)[0].getLatestLeafNode()
  }

  public getMessage(): Message | null {
    return this._message
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

  public getParentNode(): MessageTreeNode | null {
    return this._parentNode
  }

  public getChildrenCount(): number {
    return this._childNodes.length
  }

  public getIndexOfChild(node: MessageTreeNode): number {
    return this._childNodes.indexOf(node)
  }

  public getChildAtIndex(index: number): MessageTreeNode {
    return this._childNodes[index]
  }
}
