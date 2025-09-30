#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Business System Development Environment...\n');

// Start Express server
console.log('📡 Starting Express server on port 3001...');
const server = spawn('npm', ['run', 'dev:server'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

// Start Next.js frontend
console.log('🎨 Starting Next.js frontend on port 3000...');
const frontend = spawn('npm', ['run', 'dev:client'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  server.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  server.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Express server error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Next.js frontend error:', err);
});

console.log('✅ Both servers are starting...');
console.log('📊 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:3001');
console.log('💡 Press Ctrl+C to stop both servers\n');
