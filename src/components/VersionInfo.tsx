import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { fetchWithAuth } from '../utils/api';

interface VersionData {
  version: string;
  platform: string;
  build_number: number;
  release_date: string;
  description: string;
}

interface ApiResponse {
  success: boolean;
  data: VersionData;
}

export function VersionInfo() {
  const [version, setVersion] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth('/api/version')
      .then(res => res.json() as Promise<ApiResponse>)
      .then(data => {
        if (data.success) {
          setVersion(data.data);
        } else {
          setError('Failed to fetch version');
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">Error: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!version) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          App Version
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Version: {version.version}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Platform: {version.platform}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Build: {version.build_number}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Released: {new Date(version.release_date).toLocaleDateString()}
        </Typography>
        {version.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {version.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}


