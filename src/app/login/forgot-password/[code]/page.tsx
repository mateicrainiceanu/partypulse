import { ChangePassword } from '@/app/dash/settings/ChangePassword'
import React from 'react'

function ResetFormCode({params}: {params: {code: string}}) {
  return (
    <div className='max-w-lg mx-auto'>
        <ChangePassword code={params.code}/>
    </div>
  )
}

export default ResetFormCode