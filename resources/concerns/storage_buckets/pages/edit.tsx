import * as React from 'react'
import StorageLayout from '../storage_layout'
import DeleteStorageBucketCard from '../components/delete_storage_bucket_card'

interface EditProps {}

const Edit: React.FunctionComponent<EditProps> = () => {
  return (
    <StorageLayout>
      <DeleteStorageBucketCard />
    </StorageLayout>
  )
}

export default Edit
