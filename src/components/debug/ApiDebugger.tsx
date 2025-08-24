import React, { useState, useEffect } from 'react';
import { useProspects } from '../../hooks/useProspects';
import { Button } from '../../design-system';

export const ApiDebugger: React.FC = () => {
  const { prospects, loading, error, pagination, fetchProspects } = useProspects();
  const [showDebug, setShowDebug] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);

  const testApiDirectly = async () => {
    try {
      setApiTestResult({ loading: true, error: null, data: null });
      
      const response = await fetch('https://mercatto.app/v1/api/main/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "isMemberShip": true,
          "isType": false
        })
      });

      const data = await response.json();
      setApiTestResult({ loading: false, error: null, data });
    } catch (error) {
      setApiTestResult({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error', 
        data: null 
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {showDebug ? '🔒 Hide Debug' : '🐛 Show Debug'}
      </Button>

      {showDebug && (
        <div className="absolute bottom-16 right-0 w-96 bg-black/90 text-white p-4 rounded-lg shadow-xl border border-gray-600 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4 text-red-400">🔧 API Debugger</h3>
          
          {/* Estado actual */}
          <div className="mb-4">
            <h4 className="font-semibold text-yellow-400 mb-2">📊 Estado Actual:</h4>
            <div className="text-sm space-y-1">
              <div>Loading: <span className={loading ? 'text-green-400' : 'text-red-400'}>{loading ? '✅' : '❌'}</span></div>
              <div>Error: <span className={error ? 'text-red-400' : 'text-green-400'}>{error || 'None'}</span></div>
              <div>Prospects count: <span className="text-blue-400">{prospects.length}</span></div>
              <div>Pagination: <span className="text-blue-400">{pagination.page}/{pagination.totalPages} (Total: {pagination.total})</span></div>
            </div>
          </div>

          {/* Test API Directamente */}
          <div className="mb-4">
            <h4 className="font-semibold text-yellow-400 mb-2">🧪 Test API Directo:</h4>
            <Button
              onClick={testApiDirectly}
              disabled={apiTestResult?.loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mb-2"
            >
              {apiTestResult?.loading ? 'Testing...' : 'Test API'}
            </Button>
            
            {apiTestResult && (
              <div className="text-sm">
                {apiTestResult.loading && <div className="text-yellow-400">Testing API...</div>}
                {apiTestResult.error && (
                  <div className="text-red-400">
                    <div className="font-semibold">Error:</div>
                    <div className="break-all">{apiTestResult.error}</div>
                  </div>
                )}
                {apiTestResult.data && (
                  <div className="text-green-400">
                    <div className="font-semibold">Success!</div>
                    <div className="text-xs break-all">
                      {JSON.stringify(apiTestResult.data, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primer prospecto */}
          {prospects.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-yellow-400 mb-2">👤 Primer Prospecto:</h4>
              <div className="text-xs bg-gray-800 p-2 rounded">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(prospects[0], null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Refresh button */}
          <div className="mb-4">
            <Button
              onClick={() => fetchProspects()}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              🔄 Refresh Data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
