"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCreateResume, useDeleteResume } from "../actions/resume.mutate"
import { myResumesQueryOptions } from "../queries/options"

export function ResumeManager() {
  const t = useTranslations("SeekerResumes")
  const { data, isPending } = useQuery(myResumesQueryOptions())
  const createResume = useCreateResume()
  const deleteResume = useDeleteResume()
  const [title, setTitle] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  return (
    <div className="grid max-w-md gap-6 text-sm">
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          createResume.mutate(
            { title, fileUrl },
            {
              onSuccess: () => {
                setTitle("")
                setFileUrl("")
              },
            },
          )
        }}
      >
        <label className="grid gap-1">
          <span>{t("title")}</span>
          <input
            required
            className="border-input bg-background rounded-md border px-2 py-1.5"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>{t("fileUrl")}</span>
          <input
            required
            type="url"
            className="border-input bg-background rounded-md border px-2 py-1.5"
            value={fileUrl}
            onChange={(event) => setFileUrl(event.target.value)}
          />
        </label>
        <Button type="submit" disabled={createResume.isPending}>
          {createResume.isPending ? t("saving") : t("add")}
        </Button>
        {createResume.isError ? <p className="text-destructive">{t("error")}</p> : null}
      </form>

      {isPending ? <p className="text-muted-foreground">…</p> : null}
      {!isPending && !data?.length ? <p className="text-muted-foreground">{t("empty")}</p> : null}
      <ul className="grid gap-2">
        {data?.map((resume) => (
          <li key={resume.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
            <a className="underline" href={resume.fileUrl} target="_blank" rel="noreferrer">
              {resume.title}
            </a>
            <Button
              size="xs"
              variant="outline"
              disabled={deleteResume.isPending}
              onClick={() => deleteResume.mutate(resume.id)}
            >
              {t("remove")}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
