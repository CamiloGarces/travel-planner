import { useState } from 'react';
import { uploadUrl } from '../api';
import { useAuth } from '../auth/AuthContext';

export default function Upload() {
  const { token } = useAuth();
  const [msg, setMsg] = useState('');

  async function change(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !token) {
      return;
    }

    try {
      setMsg('Uploading…');
      const { uploadUrl: signedUrl, key } = await uploadUrl(
        file.name,
        file.type || 'application/octet-stream',
        token,
      );

      const response = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      if (!response.ok) {
        throw new Error('S3 upload failed');
      }

      setMsg(`Uploaded: ${key}`);
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  return (
    <section>
      <h1>Travel photos</h1>
      <p>Uploads use a five-minute S3 presigned URL.</p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={change}
      />
      {msg && <p className="message">{msg}</p>}
    </section>
  );
}
