export type Runtime = 'JavaScript' | 'PHP' | 'Python' | 'Java'

export const codeTemplates: Record<Runtime, Record<'postgres' | 'mysql' | 'redis', string>> = {
  JavaScript: {
    postgres: `const { Pool } = require('pg');
const pool = new Pool({
  connectionString: '{{databaseUri}}'
});

pool.query('SELECT * FROM users', (error, results) => {
  if (error) {
    throw error;
  }
  console.log('postgres Results:', results.rows);
});`,
    mysql: `const mysql = require('mysql');
const mysqlClient = mysql.createConnection('{{databaseUri}}');

connection.connect();

connection.query('SELECT * FROM users', (error, results, fields) => {
  if (error) {
    throw error;
  }
  console.log('MySQL Results:', results);
});

connection.end();`,
    redis: `const redis = require('redis');
const client = redis.createClient({ url: '{{databaseUri}}' });

client.get('key', (error, result) => {
  if (error) {
    throw error;
  }
  console.log('Redis Result:', result);
});`,
  },
  PHP: {
    postgres: `<?php
$conn = pg_connect($databaseUri);

if (!$conn) {
  die('postgres connection failed');
}

$query = 'SELECT * FROM users';
$result = pg_query($conn, $query);

if (!$result) {
  die('postgres query failed');
}

while ($row = pg_fetch_assoc($result)) {
  print_r($row);
}

pg_close($conn);
?>`,
    mysql: `<?php
$conn = mysqli_connect('{{host}}', '{{username}}', '{{password}}', '{{name}}');

if (!$conn) {
  die('MySQL connection failed');
}

$query = 'SELECT * FROM users';
$result = mysqli_query($conn, $query);

if (!$result) {
  die('MySQL query failed');
}

while ($row = mysqli_fetch_assoc($result)) {
  print_r($row);
}

mysqli_close($conn);
?>`,
    redis: `<?php
$databaseUri = '{{databaseUri}}';
$redis = new Redis();
$redis->connect($databaseUri);

$value = $redis->get('key');
if ($value === false) {
  die('Redis key not found');
}

echo 'Redis Result: ' . $value;
?>`,
  },
  Python: {
    postgres: `import psycopg2

conn = psycopg2.connect('{{databaseUri}}')
cursor = conn.cursor()

cursor.execute('SELECT * FROM users')
records = cursor.fetchall()

for record in records:
    print(record)

cursor.close()
conn.close()`,
    mysql: `import mysql.connector

conn = mysql.connector.connect(
  host='{{host}}',
  user='{{username}}',
  password='{{password}}',
  database='{{name}}'
)

cursor = conn.cursor()

cursor.execute('SELECT * FROM users')
records = cursor.fetchall()

for record in records:
    print(record)

cursor.close()
conn.close()`,
    redis: `import redis

r = redis.StrictRedis.from_url('{{databaseUri}}')

value = r.get('key')
if value is not None:
    print('Redis Result:', value.decode('utf-8'))
else:
    print('Redis key not found')`,
  },
  Java: {
    postgres: `import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class postgresExample {
    public static void main(String[] args) {
        String databaseUri = "{{databaseUri}}";
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(databaseUri);
            Statement statement = connection.createStatement();
            String query = "SELECT * FROM users";
            ResultSet resultSet = statement.executeQuery(query);

            while (resultSet.next()) {
                System.out.println(resultSet.getString("column_name"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (connection != null) {
                    connection.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}`,
    mysql: `import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class MySQLExample {
    public static void main(String[] args) {
        String databaseUri = "{{databaseUri}}";
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(databaseUri);
            Statement statement = connection.createStatement();
            String query = "SELECT * FROM users";
            ResultSet resultSet = statement.executeQuery(query);

            while (resultSet.next()) {
                System.out.println(resultSet.getString("column_name"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (connection != null) {
                    connection.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}`,
    redis: `import redis.clients.jedis.Jedis;

public class RedisExample {
    public static void main(String[] args) {
        String databaseUri = "{{databaseUri}}";
        Jedis jedis = new Jedis(databaseUri);

        String value = jedis.get("key");
        if (value != null) {
            System.out.println("Redis Result: " + value);
        } else {
            System.out.println("Redis key not found");
        }

        jedis.close();
    }
}`,
  },
}

export const formatTemplate = (payload: {
  databaseUri: string
  runtime: Runtime
  database: 'postgres' | 'mysql' | 'redis'
  host: string
  name: string
  username: string
  password: string
}): string => {
  const { databaseUri, runtime, database } = payload
  const template = codeTemplates[runtime][database]

  if (!template) {
    throw new Error(`Template not found for runtime '${runtime}' and database '${database}'`)
  }

  return template
    .replace('{{databaseUri}}', databaseUri)
    .replace('{{host}}', payload.host)
    .replace('{{name}}', payload.name)
    .replace('{{username}}', payload.username)
    .replace('{{password}}', payload.password)
}
