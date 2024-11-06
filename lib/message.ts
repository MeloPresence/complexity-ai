import { type Message } from "ai"

export interface MessageDataModel {
  role: Message["role"]
  content: Message["content"]
}

export interface MessageTreeNodeDataModel {
  message: Message | null
  parentNode: MessageTreeNodeDataModel | null
  childNodes: MessageTreeNodeDataModel[]
}

export class MessageTreeNode {
  public constructor(
    private readonly message: Message | null = null, // null if root node
    private parentNode: MessageTreeNode | null = null,
    private readonly childNodes: MessageTreeNode[] = [],
  ) {}

  public toJson(): MessageTreeNodeDataModel {
    const {
      message,
      parentNode: parentNodeInstance,
      childNodes: childNodeInstances,
    } = this
    const parentNode = parentNodeInstance?.toJson() || null
    const childNodes = childNodeInstances.map((node) => node.toJson())
    return { message, parentNode, childNodes }
  }

  // Excludes the root, which has no message
  public getMessageNodePath(): MessageTreeNode[] {
    if (!this.parentNode || !this.message) return []
    return [...this.parentNode.getMessageNodePath(), this]
  }

  public getMessagesUpToThisNode(): Message[] {
    return this.getMessageNodePath().map((node) => node.getMessage()!)
  }

  public getLatestLeafNode(): MessageTreeNode {
    if (this.childNodes.length === 0) return this

    return this.childNodes.at(-1)!.getLatestLeafNode()
  }

  public getMessage(): Message | null {
    return this.message
  }

  public createChild(message: Message): MessageTreeNode {
    const newNode = new MessageTreeNode(message, this)
    this.childNodes.push(newNode)
    return newNode
  }

  public popChild(): MessageTreeNode | undefined {
    const childNode = this.childNodes.pop()
    if (childNode) childNode.parentNode = null
    return childNode
  }

  public getParentNode(): MessageTreeNode | null {
    return this.parentNode
  }

  public getChildrenCount(): number {
    return this.childNodes.length
  }

  public getIndexOfChild(node: MessageTreeNode): number {
    return this.childNodes.indexOf(node)
  }

  public getChildAtIndex(index: number): MessageTreeNode {
    return this.childNodes[index]
  }
}
