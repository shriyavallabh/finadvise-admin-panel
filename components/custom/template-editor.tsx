"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/components/lib/utils"
import { Template, TemplateType, TemplateStatus } from "@/types"
import {
  Save,
  Eye,
  Smartphone,
  Monitor,
  Plus,
  Trash2,
  Image,
  Video,
  FileText,
  Link,
  Phone
} from 'lucide-react'

interface TemplateEditorProps {
  template?: Template
  onSave?: (template: Partial<Template>) => void
  onPreview?: (template: Partial<Template>) => void
  className?: string
  readOnly?: boolean
}

export function TemplateEditor({
  template,
  onSave,
  onPreview,
  className,
  readOnly = false
}: TemplateEditorProps) {
  const [editingTemplate, setEditingTemplate] = useState<Partial<Template>>({
    name: '',
    type: TemplateType.WHATSAPP,
    content: {
      body: '',
      buttons: [],
      media: []
    },
    variables: [],
    status: TemplateStatus.DRAFT,
    ...template
  })

  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    if (template) {
      setEditingTemplate({ ...template })
    }
  }, [template])

  const handleSave = () => {
    if (onSave) {
      onSave(editingTemplate)
    }
  }

  const handlePreview = () => {
    if (onPreview) {
      onPreview(editingTemplate)
    }
  }

  const addButton = () => {
    const newButton = {
      type: 'url' as const,
      text: 'New Button',
      url: 'https://example.com'
    }

    setEditingTemplate(prev => ({
      ...prev,
      content: {
        ...prev.content!,
        buttons: [...(prev.content?.buttons || []), newButton]
      }
    }))
  }

  const removeButton = (index: number) => {
    setEditingTemplate(prev => ({
      ...prev,
      content: {
        ...prev.content!,
        buttons: prev.content?.buttons?.filter((_, i) => i !== index) || []
      }
    }))
  }

  const addVariable = () => {
    const newVariable = {
      name: 'new_variable',
      type: 'text' as const,
      required: false,
      description: 'New variable'
    }

    setEditingTemplate(prev => ({
      ...prev,
      variables: [...(prev.variables || []), newVariable]
    }))
  }

  const removeVariable = (index: number) => {
    setEditingTemplate(prev => ({
      ...prev,
      variables: prev.variables?.filter((_, i) => i !== index) || []
    }))
  }

  const getTemplatePreview = () => {
    const { content } = editingTemplate
    if (!content) return null

    const processedBody = content.body?.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      const variable = editingTemplate.variables?.find(v => v.name === varName)
      return variable?.defaultValue || `{${varName}}`
    })

    return (
      <div className={cn(
        "border rounded-lg p-4 bg-background",
        previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
      )}>
        {/* Header */}
        {content.header && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              {content.header.type === 'image' && <Image className="w-4 h-4" />}
              {content.header.type === 'video' && <Video className="w-4 h-4" />}
              {content.header.type === 'document' && <FileText className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {content.header.content}
              </span>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="mb-4 whitespace-pre-wrap text-sm">
          {processedBody}
        </div>

        {/* Media */}
        {content.media && content.media.length > 0 && (
          <div className="mb-4 space-y-2">
            {content.media.map((media, index) => (
              <div key={index} className="p-2 bg-muted rounded border-dashed border-2">
                <div className="flex items-center gap-2 text-sm">
                  {media.type === 'image' && <Image className="w-4 h-4" />}
                  {media.type === 'video' && <Video className="w-4 h-4" />}
                  <span>{media.filename || 'Media file'}</span>
                </div>
                {media.caption && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {media.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        {content.buttons && content.buttons.length > 0 && (
          <div className="space-y-2">
            {content.buttons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                {button.type === 'url' && <Link className="w-3 h-3 mr-2" />}
                {button.type === 'phone' && <Phone className="w-3 h-3 mr-2" />}
                {button.text}
              </Button>
            ))}
          </div>
        )}

        {/* Footer */}
        {content.footer && (
          <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
            {content.footer}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Template Editor
          </CardTitle>
          <CardDescription>
            Design and customize your message templates
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {editingTemplate.type?.toUpperCase()}
          </Badge>
          <Badge variant={
            editingTemplate.status === TemplateStatus.APPROVED ? 'success' :
            editingTemplate.status === TemplateStatus.PENDING_APPROVAL ? 'warning' :
            'secondary'
          }>
            {editingTemplate.status?.replace('_', ' ').toUpperCase()}
          </Badge>

          {!readOnly && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 gap-6">
        {/* Editor Panel */}
        <div className="flex-1 space-y-6">
          {/* Template Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Name</label>
            <Input
              value={editingTemplate.name}
              onChange={(e) => setEditingTemplate(prev => ({
                ...prev,
                name: e.target.value
              }))}
              placeholder="Enter template name"
              readOnly={readOnly}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Message Body</label>
                <textarea
                  className="w-full min-h-[200px] p-3 border rounded-md resize-y"
                  value={editingTemplate.content?.body || ''}
                  onChange={(e) => setEditingTemplate(prev => ({
                    ...prev,
                    content: {
                      ...prev.content!,
                      body: e.target.value
                    }
                  }))}
                  placeholder="Enter your message content here. Use {{variable_name}} for dynamic content."
                  readOnly={readOnly}
                />
                <p className="text-xs text-muted-foreground">
                  Use variables like {{{'name'}}} or {{{'amount'}}} for personalization
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Footer (Optional)</label>
                <Input
                  value={editingTemplate.content?.footer || ''}
                  onChange={(e) => setEditingTemplate(prev => ({
                    ...prev,
                    content: {
                      ...prev.content!,
                      footer: e.target.value
                    }
                  }))}
                  placeholder="Footer text"
                  readOnly={readOnly}
                />
              </div>
            </TabsContent>

            {/* Buttons Tab */}
            <TabsContent value="buttons" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Action Buttons</h3>
                {!readOnly && (
                  <Button size="sm" variant="outline" onClick={addButton}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Button
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {editingTemplate.content?.buttons?.map((button, index) => (
                  <div key={index} className="p-3 border rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Button {index + 1}</span>
                      {!readOnly && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeButton(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Button text"
                        value={button.text}
                        onChange={(e) => {
                          const newButtons = [...(editingTemplate.content?.buttons || [])]
                          newButtons[index] = { ...button, text: e.target.value }
                          setEditingTemplate(prev => ({
                            ...prev,
                            content: { ...prev.content!, buttons: newButtons }
                          }))
                        }}
                        readOnly={readOnly}
                      />
                      <select
                        className="px-3 py-2 border rounded-md text-sm"
                        value={button.type}
                        onChange={(e) => {
                          const newButtons = [...(editingTemplate.content?.buttons || [])]
                          newButtons[index] = { ...button, type: e.target.value as any }
                          setEditingTemplate(prev => ({
                            ...prev,
                            content: { ...prev.content!, buttons: newButtons }
                          }))
                        }}
                        disabled={readOnly}
                      >
                        <option value="url">URL</option>
                        <option value="phone">Phone</option>
                        <option value="quick_reply">Quick Reply</option>
                      </select>
                    </div>

                    {(button.type === 'url' || button.type === 'phone') && (
                      <Input
                        placeholder={button.type === 'url' ? 'https://example.com' : '+1234567890'}
                        value={button.type === 'url' ? button.url : button.phone}
                        onChange={(e) => {
                          const newButtons = [...(editingTemplate.content?.buttons || [])]
                          newButtons[index] = {
                            ...button,
                            [button.type]: e.target.value
                          }
                          setEditingTemplate(prev => ({
                            ...prev,
                            content: { ...prev.content!, buttons: newButtons }
                          }))
                        }}
                        readOnly={readOnly}
                      />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Variables Tab */}
            <TabsContent value="variables" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Template Variables</h3>
                {!readOnly && (
                  <Button size="sm" variant="outline" onClick={addVariable}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Variable
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {editingTemplate.variables?.map((variable, index) => (
                  <div key={index} className="p-3 border rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Variable {index + 1}</span>
                      {!readOnly && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeVariable(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Variable name"
                        value={variable.name}
                        onChange={(e) => {
                          const newVariables = [...(editingTemplate.variables || [])]
                          newVariables[index] = { ...variable, name: e.target.value }
                          setEditingTemplate(prev => ({
                            ...prev,
                            variables: newVariables
                          }))
                        }}
                        readOnly={readOnly}
                      />
                      <select
                        className="px-3 py-2 border rounded-md text-sm"
                        value={variable.type}
                        onChange={(e) => {
                          const newVariables = [...(editingTemplate.variables || [])]
                          newVariables[index] = { ...variable, type: e.target.value as any }
                          setEditingTemplate(prev => ({
                            ...prev,
                            variables: newVariables
                          }))
                        }}
                        disabled={readOnly}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="url">URL</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>

                    <Input
                      placeholder="Default value (optional)"
                      value={variable.defaultValue || ''}
                      onChange={(e) => {
                        const newVariables = [...(editingTemplate.variables || [])]
                        newVariables[index] = { ...variable, defaultValue: e.target.value }
                        setEditingTemplate(prev => ({
                          ...prev,
                          variables: newVariables
                        }))
                      }}
                      readOnly={readOnly}
                    />

                    <Input
                      placeholder="Description"
                      value={variable.description}
                      onChange={(e) => {
                        const newVariables = [...(editingTemplate.variables || [])]
                        newVariables[index] = { ...variable, description: e.target.value }
                        setEditingTemplate(prev => ({
                          ...prev,
                          variables: newVariables
                        }))
                      }}
                      readOnly={readOnly}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="w-96 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Preview</h3>
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                size="sm"
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('mobile')}
                className="h-6 px-2"
              >
                <Smartphone className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('desktop')}
                className="h-6 px-2"
              >
                <Monitor className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="border rounded-md p-4 bg-muted/20 min-h-[400px]">
            {getTemplatePreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}