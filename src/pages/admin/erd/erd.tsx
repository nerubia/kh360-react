import { useCallback, useEffect } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Edge,
  type Connection,
  type NodeProps,
  type Node,
  Handle,
  Position,
  type HandleType,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { getSchema } from "@services/api"

export type CustomNodeProps = Node<{
  name: string
  rows: Row[]
}>

interface Row {
  id: string
  name: string
  type: string
  default: string | number | boolean
  relation: Relation | null
}

interface Relation {
  type: "one-to-one" | "one-to-many" | "many-to-many"
  handleType: HandleType
  position: Position
}

export const CustomRow = ({ row }: { row: Row }) => {
  return (
    <tr>
      <td className='relative text-sm border-t-2 border-r-2 p-2'>
        {row.relation?.position === Position.Left && (
          <Handle
            id={row.id}
            type={row.relation.handleType}
            position={row.relation.position}
            className='!w-3 !h-3 !border-2 !-left-[1px]'
          />
        )}
        {row.name}
      </td>
      <td className='text-sm border-t-2 border-r-2 p-2'>{row.type}</td>
      <td className='relative text-sm border-t-2 p-2'>
        {row.default}
        {row.relation?.position === Position.Right && (
          <Handle
            id={row.id}
            type={row.relation.handleType}
            position={row.relation.position}
            className='!w-3 !h-3 !border-2 !-right-[1px]'
          />
        )}
      </td>
    </tr>
  )
}

export const CustomNode = (props: NodeProps<CustomNodeProps>) => {
  return (
    <div className='bg-white border-2 border-black rounded-md'>
      <table>
        <thead>
          <tr>
            <th className='border-b-2 border-black' colSpan={3}>
              {props.data.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data.rows.map((row, index) => (
            <CustomRow key={index} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const nodeTypes = { customNode: CustomNode }

interface PropertyData {
  type?: string | string[]
  format?: string
  items?: Reference
  anyOf?: AnyOf[]
  default?: string
  $ref?: string
}

interface AnyOf {
  type?: string
  $ref?: string
}

interface Reference {
  $ref: string
}

const parsePropertyData = (value: PropertyData) => {
  if (typeof value.type === "string") {
    if (value.type === "string") {
      return "String"
    }
    if (value.type === "integer") {
      return "Integer"
    }
    if (value.type === "array") {
      if (value.items != null) {
        const referenceKey = value.items.$ref.replace("#/definitions/", "")
        return `${referenceKey}[]`
      }
    }
  }
  if (Array.isArray(value.type)) {
    const newTypes = value.type.map((type) => {
      if (type === "string") {
        return "String"
      }
      if (type === "integer") {
        return "Integer"
      }
      if (type === "boolean") {
        return "Boolean"
      }
      if (type === "null") {
        return "?"
      }
      return type
    })
    return newTypes.join("")
  }
  if (value.anyOf != null) {
    const newTypes = value.anyOf.map((anyOfValue) => {
      if (anyOfValue.type != null) {
        if (anyOfValue.type === "null") {
          return "?"
        }
      }
      if (anyOfValue.$ref != null) {
        const referenceKey = anyOfValue.$ref.replace("#/definitions/", "")
        return referenceKey
      }
      return anyOfValue
    })
    return newTypes.join("")
  }
  if (value.$ref != null) {
    const referenceKey = value.$ref.replace("#/definitions/", "")
    return `${referenceKey}`
  }
  return "Unknown"
}

const parsePropertyDefault = (value: PropertyData) => {
  if (value.default === "") {
    return '""'
  }
  if (typeof value.default === "number") {
    return value.default
  }
  if (typeof value.default === "boolean") {
    return value.default ? "true" : "false"
  }
  return ""
}

const parseRelation = (value: PropertyData) => {
  if (typeof value.type === "string") {
    if (value.type === "array") {
      if (value.items != null) {
        const referenceKey = value.items.$ref.replace("#/definitions/", "")
        return `${referenceKey}`
      }
    }
  }
  if (value.anyOf != null) {
    const newTypes = value.anyOf.map((anyOfValue) => {
      if (anyOfValue.$ref != null) {
        const referenceKey = anyOfValue.$ref.replace("#/definitions/", "")
        return referenceKey
      }
      return ""
    })
    return newTypes.join("")
  }
  if (value.$ref != null) {
    const referenceKey = value.$ref.replace("#/definitions/", "")
    return `${referenceKey}`
  }
  return null
}

export default function Erd() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    void handleGetSchema()
  }, [])

  const handleGetSchema = async () => {
    const response = await getSchema()
    const schema = await response.data

    if (schema.definitions === undefined) return

    const parsedNodes: Node[] = []

    const allowedList = ["project_members", "project_member_skills"]

    let index = 0
    const definitions = Object.keys(schema.definitions)
    for (const definition of definitions) {
      if (!allowedList.includes(definition)) continue

      const data = schema.definitions[definition]

      const parsedProperties: Row[] = []

      const properties = Object.keys(data.properties)
      for (const property of properties) {
        const propertyData = data.properties[property] as PropertyData

        let relation: Relation | null = null

        const relationModel = parseRelation(propertyData)
        if (relationModel !== null && definitions.includes(relationModel)) {
          const exist = parsedNodes.find((node) => node.data.name === relationModel)
          if (exist === undefined) {
            relation = {
              type: "one-to-many",
              handleType: "source",
              position: Position.Right,
            }
          } else {
            relation = {
              type: "one-to-many",
              handleType: "target",
              position: Position.Right,
            }
          }
        }

        parsedProperties.push({
          id: relationModel ?? property,
          name: property,
          type: parsePropertyData(propertyData),
          default: parsePropertyDefault(propertyData),
          relation,
        })
      }

      parsedNodes.push({
        id: definition,
        position: { x: 100 * index, y: 0 },
        data: {
          name: definition,
          rows: parsedProperties,
        },
        type: "customNode",
      })

      index++
    }

    setNodes(parsedNodes)

    const parsedEdges: Edge[] = []
    parsedNodes.forEach((node) => {
      const rows = node.data.rows as Row[]
      rows.forEach((row) => {
        if (row.relation != null && row.relation.handleType === "target") {
          const edgeId = `${node.id}-${row.id}`
          const exist = parsedEdges.find((edge) => edge.id === edgeId)
          if (exist === undefined) {
            parsedEdges.push({
              id: edgeId,
              source: row.id,
              sourceHandle: node.id,
              target: node.id,
              targetHandle: row.id,
              type: "smoothstep",
            })
          }
        }
      })
    })

    setEdges(parsedEdges)
  }

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  // TODO:update handle position
  const onNodeDragStop = (e: React.MouseEvent, node: Node, nodes: Node[]) => {
    // eslint-disable-next-line no-console
    console.log(node)
    // const currentNode = nodes.find((node) => node.id === currentNodeId)
    // const relationNode = nodes.find((node) => node.id === row.id)
    // if (currentNode !== undefined && relationNode !== undefined) {
    //   if (currentNode.position.x < relationNode.position.x) {
    //     setPosition(Position.Right)
    //   } else {
    //     setPosition(Position.Left)
    //   }
    //   updateNodeInternals(currentNode.id)
    // }
  }

  return (
    <div style={{}} className='w-full h-[calc(100vh_-_104px)]'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
