import logging

log = logging.getLogger()
log.setLevel('INFO')
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%asctime)s[%(levelname)s]%(name)s:%(message)s"))
log.addHandler(handler)

from cassandra import ConsistencyLevel
from cassandra.cluster import Cluster
from cassandra.query import SimpleStatement

KEYSPACE = "test"

def createKeySpace():
    cluster = Cluster(contact_points=['127.0.0.1'],port=9142)
    session = cluster.connect()

    log.info("Createing keyspace....")
    try:
        session.execute("""
            CREATE KEYSPACE %s
            WITH replication = { 'class': 'SimpleStrategy', 'replication_factor':'2'}
            """ % KEYSPACE)

        log.info("setting keyspace...")
        session.set_keyspace(KEYSPACE)

        log.info("creating table...")
        session.execute("""
            CREATE TABLE mytable(
                email text,
                name text,
                location text,
                PRIMARY KEY(email, name)
            )
            """)
    except Exeception as e:
        log.error("Unable to create keyspace")
        log.error(e)


# createKeySpace();


# insert data
def insertDate(number):
    cluster = Cluster(contact_points=['127.0.0.1'],port=9142)
    session = cluster.connect()
    log.info("seting keyspace")
    session.set_keyspace(KEYSPACE)

    prepared = session.prepare("""
        INSERT INTO mytable (email, name, location)
        VALUES (?,?,?)
        """)

    for i in range(number):
        if(i%100 == 0):
            log.info("inserting row %d" %i)
            session.execute(prepare.bind(("rec_key_%d" % i, 'aaa', 'bbb')))

insertDate(1000)

    
