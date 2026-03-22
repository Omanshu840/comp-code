import { graphqlRequest } from "@/lib/graphql-client"

const UPDATE_SUBMISSION_NOTE_MUTATION = `
  mutation updateSubmissionNote(
    $submissionId: ID!
    $note: String
    $tagIds: [Int]
    $flagType: SubmissionFlagTypeEnum
  ) {
    updateSubmissionNote(
      submissionId: $submissionId
      note: $note
      tagIds: $tagIds
      flagType: $flagType
    ) {
      ok
      error
    }
  }
`

type UpdateSubmissionNoteResponse = {
  updateSubmissionNote: {
    ok: boolean
    error: string | null
  } | null
}

type UpdateSubmissionNoteParams = {
  submissionId: string
  note: string
}

export async function updateSubmissionNote({
  submissionId,
  note,
}: UpdateSubmissionNoteParams): Promise<void> {
  const data = await graphqlRequest<UpdateSubmissionNoteResponse>({
    query: UPDATE_SUBMISSION_NOTE_MUTATION,
    variables: {
      submissionId,
      note,
      tagIds: [],
      flagType: "WHITE",
    },
  })

  if (!data.updateSubmissionNote?.ok) {
    throw new Error(
      data.updateSubmissionNote?.error ?? "Failed to update submission note",
    )
  }
}
